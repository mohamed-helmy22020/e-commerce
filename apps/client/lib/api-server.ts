// lib/api-server.ts
import { cookies } from "next/headers";

const API_BASE = process.env.API_URL || "http://localhost:5000";

type FetchOptions = RequestInit & {
    skipAuth?: boolean;
    accessToken?: string; // Optional: pass explicitly if you already have it
};

/**
 * Parses a raw Set-Cookie string and forwards it to the browser
 * using Next.js cookies().set().
 */
async function forwardSetCookie(rawSetCookie: string) {
    // rawSetCookie format: "name=value; Path=/; HttpOnly; Secure; SameSite=Lax"
    const parts = rawSetCookie.split(";").map((s) => s.trim());
    const [pair, ...attrs] = parts;
    const eqIndex = pair.indexOf("=");
    const name = pair.slice(0, eqIndex).trim();
    const value = pair.slice(eqIndex + 1).trim();

    const options: Record<string, unknown> = {};

    for (const attr of attrs) {
        const eqIdx = attr.indexOf("=");
        const key = (eqIdx === -1 ? attr : attr.slice(0, eqIdx))
            .toLowerCase()
            .trim();
        const val = eqIdx === -1 ? undefined : attr.slice(eqIdx + 1).trim();

        if (key === "path") options.path = val;
        else if (key === "domain") options.domain = val;
        else if (key === "max-age") options.maxAge = Number(val);
        else if (key === "expires") options.expires = new Date(val!);
        else if (key === "httponly") options.httpOnly = true;
        else if (key === "secure") options.secure = true;
        else if (key === "samesite") {
            const lower = val?.toLowerCase();
            options.sameSite =
                lower === "strict"
                    ? "strict"
                    : lower === "none"
                      ? "none"
                      : "lax";
        }
    }

    const cookieStore = await cookies();
    cookieStore.set(name, value, options);
}

export async function api<T = Record<string, unknown>>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T> {
    const { skipAuth, headers, accessToken: explicitToken, ...rest } = options;
    const url = endpoint.startsWith("http")
        ? endpoint
        : `${API_BASE}${endpoint}`;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    // Try to get access token from cookies if not passed explicitly
    let accessToken = explicitToken;
    if (!accessToken && !skipAuth) {
        accessToken = cookieStore.get("accessToken")?.value;
    }

    const finalHeaders = new Headers(headers);
    if (!finalHeaders.has("Cookie") && cookieHeader) {
        finalHeaders.set("Cookie", cookieHeader);
    }
    if (!finalHeaders.has("Content-Type") && typeof rest.body === "string") {
        finalHeaders.set("Content-Type", "application/json");
    }
    if (!skipAuth && accessToken) {
        finalHeaders.set("Authorization", `Bearer ${accessToken}`);
    }

    let res = await fetch(url, { ...rest, headers: finalHeaders });

    if (res.status === 401 && !skipAuth) {
        // Refresh the access token
        const refreshRes = await fetch(`${API_BASE}/auth/refresh-token`, {
            method: "POST",
            headers: { Cookie: cookieHeader },
        });

        if (!refreshRes.ok) {
            throw await refreshRes
                .json()
                .catch(() => ({ error: "Unauthorized" }));
        }

        // Forward any Set-Cookie from the refresh response to the browser
        const setCookies = refreshRes.headers.getSetCookie?.() ?? [];
        for (const sc of setCookies) {
            await forwardSetCookie(sc);
        }

        const data = (await refreshRes.json()) as { accessToken?: string };
        if (!data.accessToken) {
            throw { error: "Unauthorized" };
        }
        cookieStore.set("accessToken", data.accessToken);

        finalHeaders.set("Authorization", `Bearer ${data.accessToken}`);
        res = await fetch(url, { ...rest, headers: finalHeaders });
    }

    if (!res.ok) {
        throw await res.json().catch(() => ({ error: res.statusText }));
    }
    if (res.status === 204) {
        return {} as T;
    }
    const setCookies = res.headers.getSetCookie?.() ?? [];

    for (const sc of setCookies) {
        await forwardSetCookie(sc);
    }

    return (await res.json()) as T;
}
