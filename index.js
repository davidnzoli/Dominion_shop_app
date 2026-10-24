import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import error from "./src/middlewares/error.js";
import { runMigrations } from "./src/data/runMigrations.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// ── Middlewares ───────────────────────────────────────────────
app.use(express.json());
app.use(cors());

// ── Health check (requis par Render) ─────────────────────────
app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT current_database(), NOW() as time");
        res.status(200).json({
            status: "ok",
            message: "Dominion Shop API is running 🚀",
            database: result.rows[0].current_database,
            time: result.rows[0].time,
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Database connection failed" });
    }
});

// ── Routes API ────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

// ── Gestion des routes inexistantes ──────────────────────────
app.use((req, res) => {
    res.status(404).json({ status: 404, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ── Gestion centralisée des erreurs ──────────────────────────
app.use(error);

// ── Démarrage du serveur et exécution des migrations ──────────
app.listen(port, async () => {
    console.log(`✅ Server running on http://localhost:${port}`);
    await runMigrations();
});