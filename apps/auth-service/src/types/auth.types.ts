import { UserRole } from "shared";

export type User = {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    role: UserRole;
    created_at: Date;
};
