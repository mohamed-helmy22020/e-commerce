import { User } from "../types/auth.types";

export function convertToPublicUser(user: User) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.is_email_verified,
        twoFactorEnabled: user.two_factor_enabled,
        created_at: user.created_at,
    };
}
