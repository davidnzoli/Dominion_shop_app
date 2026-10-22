import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;
dotenv.config();

// Render fournit DATABASE_URL en production
// En local on utilise les variables individuelles
const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // requis par Render
    })
    : new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

pool.on("connect", () => {
    console.log("✅ Connection pool établie avec la base de données");
});

pool.on("error", (err) => {
    console.error("❌ Erreur du pool PostgreSQL:", err.message);
});

export default pool;