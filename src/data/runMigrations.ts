import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runMigrations = async (): Promise<void> => {
    try {
        let sqlPath = path.join(__dirname, "migrations.sql");
        if (!fs.existsSync(sqlPath)) {
            sqlPath = path.join(process.cwd(), "src", "data", "migrations.sql");
        }
        const sql = fs.readFileSync(sqlPath, "utf-8");
        await pool.query(sql);
        console.log("✅ Migrations SQL exécutées avec succès");
    } catch (error: any) {
        console.error("❌ Erreur lors de l'exécution des migrations :", error.message);
    }
};

// Permet d'exécuter ce fichier directement via `npx tsx src/data/runMigrations.ts`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runMigrations().then(() => {
        pool.end();
    });
}
