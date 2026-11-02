import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: Number(process.env.PORT) || 5001,
    jwt: {
        secret: process.env.JWT_SECRET || "dominion_secret_fallback_for_dev_only",
        expiresIn: (process.env.JWT_EXPIRES_IN || "24h") as string,
    },
    db: {
        url: process.env.DATABASE_URL,
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_DATABASE || "dominion-shop-db",
    },
};

if (!process.env.JWT_SECRET) {
    console.warn(
        "⚠️  ATTENTION : JWT_SECRET n'est pas défini dans les variables d'environnement. Une clé de secours est utilisée (interdit en production financière !)."
    );
}
