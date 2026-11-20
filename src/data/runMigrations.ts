import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialiser les comptes par défaut s'ils n'existent pas encore dans la base de données
const seedDefaultUsers = async (): Promise<void> => {
    try {
        const defaultUsers = [
            {
                name: "Trésorier Central K.",
                email: "tresorier@dominionshop.cd",
                password: "Admin@2026",
                role: "admin",
            },
            {
                name: "Trésorier Central K.",
                email: "tresorier.central@dominionshop.cd",
                password: "Admin@2026",
                role: "admin",
            },
            {
                name: "Percepteur Limete",
                email: "percepteur@dominionshop.cd",
                password: "Percepteur@2026",
                role: "percepteur",
            },
            {
                name: "Percepteur Limete",
                email: "percepteur.limete@dominionshop.cd",
                password: "Percepteur@2026",
                role: "percepteur",
            },
        ];

        for (const u of defaultUsers) {
            const check = await pool.query(
                "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
                [u.email]
            );
            if (check.rows.length === 0) {
                const hash = await bcrypt.hash(u.password, 10);
                await pool.query(
                    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
                    [u.name, u.email.toLowerCase(), hash, u.role]
                );
                console.log(`👤 Compte initial créé en base : ${u.email} (${u.role})`);
            }
        }
    } catch (err: any) {
        console.error("⚠️ Erreur lors du seeding des utilisateurs :", err.message);
    }
};

export const runMigrations = async (): Promise<void> => {
    try {
        let sqlPath = path.join(__dirname, "migrations.sql");
        if (!fs.existsSync(sqlPath)) {
            sqlPath = path.join(process.cwd(), "src", "data", "migrations.sql");
        }
        const sql = fs.readFileSync(sqlPath, "utf-8");
        await pool.query(sql);
        console.log("✅ Migrations SQL exécutées avec succès");

        // Créer les utilisateurs par défaut s'ils n'existent pas
        await seedDefaultUsers();

        // Si des utilisateurs existants ont un mot de passe NULL, leur attribuer un mot de passe par défaut
        const nullUsers = await pool.query<{ id: number; email: string }>(
            "SELECT id, email FROM users WHERE password IS NULL OR password = ''"
        );
        if (nullUsers.rows.length > 0) {
            const defaultHash = await bcrypt.hash("Dominion@2026", 10);
            for (const row of nullUsers.rows) {
                await pool.query("UPDATE users SET password = $1 WHERE id = $2", [defaultHash, row.id]);
                console.log(`🔑 Mot de passe initial (Dominion@2026) attribué au compte existant : ${row.email}`);
            }
        }
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
