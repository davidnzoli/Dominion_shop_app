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

// Trouver un utilisateur par email avec son mot de passe (insensible à la casse, utilisé pour le login)
export const getUserByEmailWithPasswordService = async (email: string): Promise<UserWithPassword | undefined> => {
    const result = await pool.query<UserWithPassword>(
        "SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))",
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

// Mettre à jour un utilisateur (supporte nom, email, mot de passe haché et rôle)
export const updateUserService = async (
    id: number | string,
    data: { name?: string; email?: string; password?: string; role?: string }
): Promise<User | undefined> => {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name) {
        fields.push(`name=$${idx++}`);
        values.push(data.name);
    }
    if (data.email) {
        fields.push(`email=$${idx++}`);
        values.push(data.email.trim().toLowerCase());
    }
    if (data.password) {
        fields.push(`password=$${idx++}`);
        values.push(data.password);
    }
    if (data.role) {
        fields.push(`role=$${idx++}`);
        values.push(data.role);
    }

    if (fields.length === 0) return getUserByIdService(id);

    values.push(id);
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id=$${idx} RETURNING id, name, email, role, created_at, updated_at`;
    const result = await pool.query<User>(query, values);
    return result.rows[0];
};

// Mettre à jour le mot de passe d'un utilisateur par son email
export const updatePasswordByEmailService = async (
    email: string,
    hashedPassword: string,
    role?: string
): Promise<User | undefined> => {
    const query = role
        ? "UPDATE users SET password=$1, role=$2 WHERE LOWER(TRIM(email))=LOWER(TRIM($3)) RETURNING id, name, email, role, created_at, updated_at"
        : "UPDATE users SET password=$1 WHERE LOWER(TRIM(email))=LOWER(TRIM($2)) RETURNING id, name, email, role, created_at, updated_at";
    const values = role ? [hashedPassword, role, email] : [hashedPassword, email];
    const result = await pool.query<User>(query, values);
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
