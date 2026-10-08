export type RefreshToken = {
    id: string;
    userId: string;
    token_hash: string;
    family_id: string;
    revoked: boolean;
    created_at: Date;
};
