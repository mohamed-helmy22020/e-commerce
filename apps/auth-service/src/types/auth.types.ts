import { UserRole } from "shared";

export type User = {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    role: UserRole;
    is_email_verified: boolean;
    two_factor_enabled: boolean;
    two_factor_secret: string;
    reset_password_token: string;
    reset_password_expires_at: Date;
    created_at: Date;
};
