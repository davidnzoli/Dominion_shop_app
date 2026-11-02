import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "./src/config/env.js";
import pool from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import errorHandler from "./src/middlewares/error.js";
import { runMigrations } from "./src/data/runMigrations.js";

const app = express();
const port = config.port;

// ── Middlewares ───────────────────────────────────────────────
app.use(express.json());
app.use(cors());

// ── Health check (requis par Render & monitoring) ─────────────
app.get("/", async (_req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT current_database(), NOW() as time");
        res.status(200).json({
            status: "ok",
            message: "Dominion Shop API is running (TypeScript) 🚀",
            database: result.rows[0]?.current_database,
            time: result.rows[0]?.time,
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Database connection failed" });
    }
});

// ── Routes API ────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

// ── Gestion des routes inexistantes ──────────────────────────
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: 404,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    });
});

// ── Gestion centralisée des erreurs ──────────────────────────
app.use(errorHandler);

// ── Démarrage du serveur et exécution des migrations ──────────
app.listen(port, async () => {
    console.log(`✅ Server running with TypeScript on http://localhost:${port}`);
    await runMigrations();
});
