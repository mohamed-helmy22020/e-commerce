import { cookies } from "next/headers";

/**
 * A small, serialisable snapshot of the signed-in user.
 *
 * The header lives in the root layout, so it needs to know who is signed in
 * without forcing the whole app to render dynamically. Instead of calling the
 * backend on every render, we keep this snapshot in an httpOnly cookie that the
 * auth actions write on login/register and clear on logout.
 */

const SESSION_USER_COOKIE = "user";

// Matches the refresh token lifetime so both expire together.
const SESSION_USER_MAX_AGE = 60 * 60 * 24 * 7;

export async function setSessionUser(user: User) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_USER_COOKIE, JSON.stringify(user), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_USER_MAX_AGE,
        secure: process.env.NODE_ENV === "production",
    });
}

export async function clearSessionUser() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_USER_COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const raw = cookieStore.get(SESSION_USER_COOKIE)?.value;
    if (!raw) {
        return null;
    }

    try {
        const parsed = JSON.parse(raw) as User;
        if (!parsed.id || !parsed.email) {
            return null;
        }
        return {
            id: parsed.id,
            name: parsed.name,
            email: parsed.email,
            role: parsed.role,
            is_email_verified: parsed.is_email_verified,
            two_factor_enabled: parsed.two_factor_enabled,
            created_at: parsed.created_at,
        };
    } catch {
        return null;
    }
}
