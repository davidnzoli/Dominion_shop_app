import pool from "../config/db.js";

// Récupérer tous les utilisateurs (sans le mot de passe)
export const getAllUserService = async () => {
    const result = await pool.query(
        "SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY id ASC"
    );
    return result.rows;
};

// Récupérer un utilisateur par ID (sans le mot de passe)
export const getUserByIdService = async (id) => {
    const result = await pool.query(
        "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id=$1",
        [id]
    );
    return result.rows[0];
};

// Trouver un utilisateur par email avec son mot de passe (utilisé uniquement pour le login)
export const getUserByEmailWithPasswordService = async (email) => {
    const result = await pool.query(
        "SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email=$1",
        [email]
    );
    return result.rows[0];
};

// Créer un utilisateur avec mot de passe haché
export const createUserService = async (name, email, hashedPassword, role = "user") => {
    const result = await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at",
        [name, email, hashedPassword, role]
    );
    return result.rows[0];
};

// Mettre à jour un utilisateur
export const updateUserService = async (id, name, email) => {
    const result = await pool.query(
        "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, role, created_at, updated_at",
        [name, email, id]
    );
    return result.rows[0];
};

// Supprimer un utilisateur
export const deleteUserService = async (id) => {
    const result = await pool.query(
        "DELETE FROM users WHERE id=$1 RETURNING id, name, email, role, created_at, updated_at",
        [id]
    );
    return result.rows[0];
};