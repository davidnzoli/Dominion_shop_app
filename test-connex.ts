import pool from "./src/config/db.js";

async function testDB(): Promise<void> {
    try {
        const res = await pool.query<{ now: Date }>("SELECT NOW()");
        console.log("✅ Connexion réussie ! Heure du serveur :", res.rows[0]?.now);
    } catch (err: any) {
        console.error("❌ Erreur de connexion à la base de données :", err.message);
    } finally {
        await pool.end(); // Ferme le pool après le test
    }
}

testDB();
