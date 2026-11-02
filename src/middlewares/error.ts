import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
    statusCode?: number;
}

const errorHandler = (
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error("❌ Erreur serveur:", err.stack || err.message);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: statusCode,
        message: err.message || "Something went wrong",
        error: process.env.NODE_ENV === "production" ? undefined : err.message,
    });
};

export default errorHandler;
