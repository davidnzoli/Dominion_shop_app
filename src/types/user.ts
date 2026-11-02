export type UserRole = "admin" | "user" | "manager";

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole | string;
    created_at: Date;
    updated_at: Date;
}

export interface UserWithPassword extends User {
    password: string;
}

export interface CreateUserInput {
    name: string;
    email: string;
    password?: string;
    role?: UserRole | string;
}
