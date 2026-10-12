type SuccessResponse<T = Record<string, unknown>> = {
    success: true;
    data: T;
};

type UserRole = "USER" | "ADMIN";

type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    twoFactorEnabled: boolean;
    created_at: string;
};

type AuthResponse = SuccessResponse<{
    message: string;
    accessToken: string;
    user: User;
}>;
