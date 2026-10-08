import { type PoolClient } from "pg";
import { getPool } from "shared";
import { RefreshToken } from "../types/token.types";

export async function findByTokenHash(
    tokenHash: string,
    providedClient?: PoolClient,
): Promise<RefreshToken | null> {
    const client = providedClient ?? getPool();
    const result = await client.query<RefreshToken>(
        `SELECT * FROM refresh_tokens WHERE token_hash = $1 FOR UPDATE`,
        [tokenHash],
    );
    return result.rows[0] ?? null;
}

export async function findByUserId(
    userId: string,
    providedClient?: PoolClient,
): Promise<RefreshToken | null> {
    const client = providedClient ?? getPool();
    const result = await client.query<RefreshToken>(
        `SELECT * FROM refresh_tokens WHERE user_id = $1`,
        [userId],
    );
    return result.rows[0] ?? null;
}

export async function addRefreshTokenHash(
    userId: string,
    refreshTokenHash: string,
    familyId?: string,
    providedClient?: PoolClient,
): Promise<RefreshToken> {
    const client = providedClient ?? getPool();
    const result = await client.query<RefreshToken>(
        `
        INSERT INTO refresh_tokens (user_id, token_hash, family_id)
        VALUES ($1, $2, COALESCE($3, gen_random_uuid()))
        RETURNING *
        `,
        [userId, refreshTokenHash, familyId],
    );
    return result.rows[0];
}

export async function revokeAllRefreshTokensByUserId(
    userId: string,
    providedClient?: PoolClient,
): Promise<boolean> {
    const client = providedClient ?? getPool();
    const result = await client.query<RefreshToken>(
        `UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = $1`,
        [userId],
    );
    return (result.rowCount ?? 0) > 0;
}

export async function revokeAllRefreshTokensByFamilyId(
    familyId: string,
    providedClient?: PoolClient,
): Promise<boolean> {
    const client = providedClient ?? getPool();
    const result = await client.query<RefreshToken>(
        `UPDATE refresh_tokens SET revoked = TRUE WHERE family_id = $1`,
        [familyId],
    );
    return (result.rowCount ?? 0) > 0;
}

export async function revokeRefreshToken(
    tokenHash: string,
    providedClient?: PoolClient,
) {
    const client = providedClient ?? getPool();
    const result = await client.query<RefreshToken>(
        `UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1 AND revoked = FALSE`,
        [tokenHash],
    );
    return result.rowCount === 1;
}
