import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authRoutes = ["/login", "/signup"];
const protectedRoutes = ["/settings"];

const home = "/";
const signIn = "/login";

const API_BASE = process.env.API_URL || "http://localhost:5000";

// Refresh this many seconds before actual expiry to avoid races.
const EXPIRY_SKEW_SECONDS = 30;

function matches(pathname: string, routes: string[]) {
    return routes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
}

function hasSession(request: NextRequest) {
    return Boolean(
        request.cookies.get("accessToken") ??
        request.cookies.get("refreshToken"),
    );
}

/**
 * Decode a JWT payload without verifying the signature. The proxy only uses
 * this to decide *whether* to refresh; the backend still does real validation.
 */
function isExpired(token: string, skewSeconds = EXPIRY_SKEW_SECONDS): boolean {
    try {
        const parts = token.split(".");
        if (parts.length < 2) return true;

        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64)) as { exp?: number };

        if (!payload.exp) return false;

        const now = Math.floor(Date.now() / 1000);
        return payload.exp <= now + skewSeconds;
    } catch {
        // Unparseable token → treat as expired so we attempt a refresh.
        return true;
    }
}

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
};

type RefreshResult = {
    accessToken: string;
    // Raw Set-Cookie headers from the backend (in case it also rotates
    // refreshToken or sets other cookies we need to forward).
    setCookies: string[];
} | null;

async function refreshAccessToken(
    refreshToken: string,
): Promise<RefreshResult> {
    try {
        const res = await fetch(`${API_BASE}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}`,
            },
            cache: "no-store",
        });

        if (!res.ok) return null;

        const setCookies = res.headers.getSetCookie?.() ?? [];

        // The backend may return the new token either in JSON or via
        // Set-Cookie. Prefer JSON; fall back to parsing Set-Cookie.
        let accessToken: string | undefined;

        try {
            const body = (await res.json()) as { accessToken?: string };
            accessToken = body.accessToken;
        } catch {
            // No JSON body — fall through to Set-Cookie parsing.
        }

        if (!accessToken) {
            accessToken = extractCookieValue(setCookies, "accessToken");
        }

        if (!accessToken) return null;

        return { accessToken, setCookies };
    } catch {
        return null;
    }
}

function extractCookieValue(
    setCookies: string[],
    name: string,
): string | undefined {
    for (const sc of setCookies) {
        const [pair] = sc.split(";");
        const eqIndex = pair.indexOf("=");
        if (eqIndex === -1) continue;
        const cookieName = pair.slice(0, eqIndex).trim();
        if (cookieName === name) {
            return pair.slice(eqIndex + 1).trim();
        }
    }
    return undefined;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Start with a pass-through response. We'll mutate its cookies if we
    // manage to refresh.
    const response = NextResponse.next();

    let refreshed = false;

    // --- 1. Opportunistic refresh -------------------------------------------
    const needsRefresh =
        Boolean(refreshToken) && (!accessToken || isExpired(accessToken));

    if (needsRefresh) {
        const result = await refreshAccessToken(refreshToken!);

        if (result) {
            refreshed = true;

            // Persist to the browser (Set-Cookie on the outgoing response).
            response.cookies.set(
                "accessToken",
                result.accessToken,
                COOKIE_OPTIONS,
            );

            // Forward any additional Set-Cookie headers from the backend
            // (e.g. if it rotates the refresh token or sets session cookies).
            for (const sc of result.setCookies) {
                forwardRawSetCookie(response, sc);
            }

            // Make the *request* also see the new token, so Server Components
            // rendered in this same request call the API with the fresh token.
            request.cookies.set("accessToken", result.accessToken);
            const newRefresh = extractCookieValue(
                result.setCookies,
                "refreshToken",
            );
            if (newRefresh) {
                request.cookies.set("refreshToken", newRefresh);
            }
        } else {
            // Refresh failed → treat as signed out.
            response.cookies.delete("accessToken");
            response.cookies.delete("refreshToken");
            request.cookies.delete("accessToken");
            request.cookies.delete("refreshToken");
        }
    }

    // --- 2. Route guarding (uses the possibly-updated request) --------------
    const signedIn = refreshed || hasSession(request);

    if (signedIn && matches(pathname, authRoutes)) {
        return NextResponse.redirect(new URL(home, request.url));
    }

    if (!signedIn && matches(pathname, protectedRoutes)) {
        const url = new URL(signIn, request.url);
        url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
        return NextResponse.redirect(url);
    }

    return response;
}

/**
 * Minimal Set-Cookie parser → write it onto a NextResponse.
 * (Server Actions / Route Handlers have a rich cookies API, but in the
 * edge proxy we only have the Set-Cookie string.)
 */
function forwardRawSetCookie(response: NextResponse, rawSetCookie: string) {
    const parts = rawSetCookie.split(";").map((s) => s.trim());
    const [pair, ...attrs] = parts;
    const eqIndex = pair.indexOf("=");
    if (eqIndex === -1) return;

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

    response.cookies.set(name, value, options);
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
    ],
};
