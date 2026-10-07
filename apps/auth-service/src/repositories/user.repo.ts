import { getPool, UserRole } from "shared";
import { User } from "../types/auth.types";

export async function findByEmail(email: string): Promise<User | null> {
    const result = await getPool().query<User>(
        `SELECT * FROM users WHERE email = $1`,
        [email],
    );
    return result.rows[0] ?? null;
}

export async function findById(id: string): Promise<User | null> {
    const result = await getPool().query<User>(
        `SELECT * FROM users WHERE id = $1`,
        [id],
    );
    return result.rows[0] ?? null;
}

export async function createUser(input: {
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
}): Promise<User> {
    const result = await getPool().query<User>(
        `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *`,
        [input.name, input.email, input.passwordHash, input.role ?? "USER"],
    );
    return result.rows[0];
}

export async function verifyEmail(userId: string) {
    const result = await getPool().query(
        `UPDATE users SET is_email_verified = TRUE WHERE id = $1`,
        [userId],
    );
    return (result.rowCount ?? 0) > 0;
}
