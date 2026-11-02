import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { AuthenticatedRequest, TokenPayload } from "../types/auth.js";

export const verifyToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void | Response => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            status: 401,
            message: "Accès refusé. Token manquant ou format invalide (Bearer <token> requis).",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
        req.user = decoded; // { id, email, role, iat, exp }
        next();
    } catch (err: unknown) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                status: 401,
                message: "Le token a expiré. Veuillez vous reconnecter.",
            });
        }
        return res.status(401).json({
            status: 401,
            message: "Token invalide.",
        });
    }
};
