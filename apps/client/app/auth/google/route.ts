import { NextResponse, type NextRequest } from "next/server";

const API_BASE =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

/**
 * Starts the Google OAuth handshake.
 *
 * The backend (auth-service) responds to GET /auth/google with a redirect to
 * Google plus an httpOnly `oauth_state` cookie. We run that request on the
 * server so the state cookie is bound to this origin (the callback below lives
 * here too), then send the browser on to Google.
 */
export async function GET(request: NextRequest) {
    const errorUrl = new URL("/login?error=google", request.nextUrl.origin);

    try {
        const res = await fetch(`${API_BASE}/auth/google`, {
            method: "GET",
            redirect: "manual",
        });

        const location = res.headers.get("location");
        if (!location) {
            return NextResponse.redirect(errorUrl);
        }

        const response = NextResponse.redirect(location);
        for (const cookie of res.headers.getSetCookie?.() ?? []) {
            response.headers.append("set-cookie", cookie);
        }
        return response;
    } catch {
        return NextResponse.redirect(errorUrl);
    }
}
