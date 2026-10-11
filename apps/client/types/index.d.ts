type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    is_email_verified: boolean;
    two_factor_enabled: boolean;
    created_at: Date;
};

type AuthResponse = {
    success: boolean;
    data: {
        message: string;
        accessToken: string;
        user: User;
    };
};
