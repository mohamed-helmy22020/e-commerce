export type RefreshToken = {
    id: string;
    user_id: string;
    token_hash: string;
    family_id: string;
    revoked: boolean;
    created_at: Date;
};
