import { NextResponse, type NextRequest } from "next/server";

const API_BASE =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

/**
 * Google OAuth callback (GOOGLE_REDIRECT_URI points here).
 *
 * Google redirects the browser here with `code` and `state`. We forward both,
 * plus the browser's cookies (the `oauth_state` set by the start route), to the
 * backend, which validates them, sets the `refreshToken` cookie and returns the
 * `accessToken`. We mirror those cookies onto this origin and drop the user
 * into the app.
 */
export async function GET(request: NextRequest) {
    const { searchParams, origin } = request.nextUrl;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const errorUrl = new URL("/login?error=google", origin);

    if (!code || !state) {
        return NextResponse.redirect(errorUrl);
    }

    try {
        const res = await fetch(
            `${API_BASE}/auth/google/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
            {
                method: "GET",
                headers: { cookie: request.headers.get("cookie") ?? "" },
                redirect: "manual",
            },
        );

        if (!res.ok) {
            return NextResponse.redirect(errorUrl);
        }

        const data = (await res.json()) as { accessToken: string };

        const response = NextResponse.redirect(new URL("/", origin));
        // response.cookies.set re-serialises the Set-Cookie header, so set the
        // access token first and only then append the forwarded backend cookies.
        response.cookies.set("accessToken", data.accessToken, {
            path: "/",
            sameSite: "lax",
        });
        for (const cookie of res.headers.getSetCookie?.() ?? []) {
            response.headers.append("set-cookie", cookie);
        }
        return response;
    } catch {
        return NextResponse.redirect(errorUrl);
    }
}
