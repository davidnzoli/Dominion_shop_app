import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runMigrations = async () => {
    try {
        const sqlPath = path.join(__dirname, "migrations.sql");
        const sql = fs.readFileSync(sqlPath, "utf-8");
        await pool.query(sql);
        console.log("✅ Migrations SQL exécutées avec succès");
    } catch (error) {
        console.error("❌ Erreur lors de l'exécution des migrations :", error.message);
    }
};

// Permet d'exécuter ce fichier directement via `node src/data/runMigrations.js`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runMigrations().then(() => {
        pool.end();
    });
}
