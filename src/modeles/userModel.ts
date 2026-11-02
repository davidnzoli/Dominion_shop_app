import pool from "../config/db.js";
import { User, UserWithPassword } from "../types/user.js";

// Récupérer tous les utilisateurs (sans le mot de passe)
export const getAllUserService = async (): Promise<User[]> => {
    const result = await pool.query<User>(
        "SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY id ASC"
    );
    return result.rows;
};

// Récupérer un utilisateur par ID (sans le mot de passe)
export const getUserByIdService = async (id: number | string): Promise<User | undefined> => {
    const result = await pool.query<User>(
        "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id=$1",
        [id]
    );
    return result.rows[0];
};

// Trouver un utilisateur par email avec son mot de passe (utilisé uniquement pour le login)
export const getUserByEmailWithPasswordService = async (email: string): Promise<UserWithPassword | undefined> => {
    const result = await pool.query<UserWithPassword>(
        "SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email=$1",
        [email]
    );
    return result.rows[0];
};

// Créer un utilisateur avec mot de passe haché
export const createUserService = async (
    name: string,
    email: string,
    hashedPassword?: string,
    role: string = "user"
): Promise<User> => {
    const result = await pool.query<User>(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at",
        [name, email, hashedPassword, role]
    );
    return result.rows[0];
};

// Mettre à jour un utilisateur
export const updateUserService = async (
    id: number | string,
    name: string,
    email: string
): Promise<User | undefined> => {
    const result = await pool.query<User>(
        "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, role, created_at, updated_at",
        [name, email, id]
    );
    return result.rows[0];
};

// Supprimer un utilisateur
export const deleteUserService = async (id: number | string): Promise<User | undefined> => {
    const result = await pool.query<User>(
        "DELETE FROM users WHERE id=$1 RETURNING id, name, email, role, created_at, updated_at",
        [id]
    );
    return result.rows[0];
};
