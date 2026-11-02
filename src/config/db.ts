import pg from "pg";
import { config } from "./env.js";

const { Pool } = pg;

const pool = config.db.url
    ? new Pool({
        connectionString: config.db.url,
        ssl: { rejectUnauthorized: false }, // Requis pour Render / bases distantes
    })
    : new Pool({
        user: config.db.user,
        host: config.db.host,
        database: config.db.database,
        password: config.db.password,
        port: config.db.port,
    });

pool.on("connect", () => {
    console.log("✅ Connection pool établie avec la base de données");
});

pool.on("error", (err: Error) => {
    console.error("❌ Erreur du pool PostgreSQL:", err.message);
});

export default pool;
