import { AppError, getPool, UserRole } from "shared";
import { User } from "../types/auth.types";

export async function findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase().trim();
    const result = await getPool().query<User>(
        `SELECT * FROM users WHERE email = $1`,
        [normalizedEmail],
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

export async function findByResetPasswordToken(
    token: string,
): Promise<User | null> {
    const result = await getPool().query<User>(
        `SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires_at > $2`,
        [token, new Date()],
    );
    return result.rows[0] ?? null;
}

export async function createUser(input: {
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
    isEmailVerified?: boolean;
}): Promise<User[]> {
    const normalizedEmail = input.email.toLowerCase().trim();
    const result = await getPool().query<User>(
        `INSERT INTO users (name, email, password_hash, role, is_email_verified) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING RETURNING *`,
        [
            input.name,
            normalizedEmail,
            input.passwordHash,
            input.role ?? "USER",
            input.isEmailVerified ?? false,
        ],
    );
    return result.rows;
}

export async function verifyEmail(userId: string) {
    await updateUserById({
        id: userId,
        userData: {
            is_email_verified: true,
        },
    });
    return true;
}

export async function updateUserById(input: {
    id: string;
    userData: Partial<User>;
}): Promise<User> {
    const {
        email,
        name,
        is_email_verified,
        password_hash,
        role,
        two_factor_enabled,
        two_factor_secret,
        reset_password_token,
        reset_password_expires_at,
    } = input.userData;
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (email !== undefined) {
        const normalizedEmail = email.toLowerCase().trim();
        setClauses.push(`email = $${paramIndex}`);
        values.push(normalizedEmail);
        paramIndex++;
    }
    if (name !== undefined) {
        setClauses.push(`name = $${paramIndex}`);
        values.push(name);
        paramIndex++;
    }
    if (is_email_verified !== undefined) {
        setClauses.push(`is_email_verified = $${paramIndex}`);
        values.push(is_email_verified);
        paramIndex++;
    }
    if (password_hash !== undefined) {
        setClauses.push(`password_hash = $${paramIndex}`);
        values.push(password_hash);
        paramIndex++;
    }
    if (role !== undefined) {
        setClauses.push(`role = $${paramIndex}`);
        values.push(role);
        paramIndex++;
    }
    if (two_factor_enabled !== undefined) {
        setClauses.push(`two_factor_enabled = $${paramIndex}`);
        values.push(two_factor_enabled);
        paramIndex++;
    }
    if (two_factor_secret !== undefined) {
        setClauses.push(`two_factor_secret = $${paramIndex}`);
        values.push(two_factor_secret);
        paramIndex++;
    }
    if (reset_password_token !== undefined) {
        setClauses.push(`reset_password_token = $${paramIndex}`);
        values.push(reset_password_token);
        paramIndex++;
    }
    if (reset_password_expires_at !== undefined) {
        setClauses.push(`reset_password_expires_at = $${paramIndex}`);
        values.push(reset_password_expires_at);
        paramIndex++;
    }
    if (setClauses.length === 0) {
        throw new Error("No fields provided for update");
    }
    values.push(input.id);
    const whereParamIndex = paramIndex;
    const query = `
    UPDATE users
    SET ${setClauses.join(", ")}
    WHERE id = $${whereParamIndex}
    RETURNING *
    `;
    const result = await getPool().query<User>(query, values);
    if (result.rows.length === 0) {
        throw new AppError("user not found", 404);
    }
    return result.rows[0];
}
