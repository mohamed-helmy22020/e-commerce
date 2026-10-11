type SuccessResponse<T = Record<string, unknown>> = {
    success: true;
    data: T;
};
type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    is_email_verified: boolean;
    two_factor_enabled: boolean;
    created_at: Date;
};

type AuthResponse = SuccessResponse<{
    message: string;
    accessToken: string;
    user: User;
}>;
