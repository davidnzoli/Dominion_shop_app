import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/env.js";
import pool from "../config/db.js";
import {
    createUserService,
    getUserByEmailWithPasswordService,
    getUserByIdService,
    updatePasswordByEmailService,
} from "../modeles/userModel.js";
import { AuthenticatedRequest } from "../types/auth.js";

// Helper pour standardiser les réponses JSON
const handleResponse = (
    res: Response,
    status: number,
    message: string,
    data: unknown = null
): Response => {
    return res.status(status).json({
        status,
        message,
        data,
    });
};

// Inscription d'un nouvel utilisateur
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { name, email, password, role = "user" } = req.body || {};

    if (!name || !email || !password) {
        return handleResponse(
            res,
            400,
            "Tous les champs sont requis (name, email, password)."
        );
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await getUserByEmailWithPasswordService(email.trim());
        if (existingUser) {
            return handleResponse(
                res,
                409,
                "Un compte avec cet email existe déjà."
            );
        }

        // Hachage sécurisé du mot de passe (sel à 10 tours)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Enregistrement dans la base de données avec le rôle fourni
        const newUser = await createUserService(name, email.trim(), hashedPassword, role);

        // Options de signature JWT
        const signOptions: SignOptions = {
            expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
        };

        // Génération du token JWT valide 24h
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            config.jwt.secret,
            signOptions
        );

        return handleResponse(res, 201, "Inscription réussie avec succès 🚀", {
            user: newUser,
            token,
            expiresIn: config.jwt.expiresIn,
        });
    } catch (err) {
        next(err);
    }
};

// Connexion d'un utilisateur existant
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return handleResponse(
            res,
            400,
            "Veuillez fournir un email et un mot de passe."
        );
    }

    try {
        // Recherche de l'utilisateur avec son hash de mot de passe (insensible à la casse et sans espaces)
        const user = await getUserByEmailWithPasswordService(email.trim());
        if (!user || !user.password) {
            return handleResponse(res, 401, "Email ou mot de passe incorrect.");
        }

        // Vérification de la correspondance du mot de passe (Bcrypt ou texte brut rétrocompatible)
        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(password, user.password);
        } catch {
            isMatch = false;
        }

        // Support direct si le mot de passe dans la base a été saisi en clair
        if (!isMatch && password === user.password) {
            isMatch = true;
            // Mise à niveau automatique vers un hash sécurisé bcrypt
            try {
                const newHash = await bcrypt.hash(password, 10);
                await pool.query("UPDATE users SET password = $1 WHERE id = $2", [newHash, user.id]);
            } catch {
                // ignore
            }
        }

        if (!isMatch) {
            return handleResponse(res, 401, "Email ou mot de passe incorrect.");
        }

        const signOptions: SignOptions = {
            expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
        };

        // Génération du token JWT valide 24h
        const token = jwt.sign(
            { id: user.id, email: user.email, password:user.password, role: user.role },
            config.jwt.secret,
            signOptions
        );

        // Exclure le hash du mot de passe de la réponse
        // const { password: _, ...userSafe } = user;

        return handleResponse(res, 200, "Connexion réussie 🔑", {
            user: user,
            token,
            expiresIn: config.jwt.expiresIn,
        });
    } catch (err) {
        next(err);
    }
};

// Récupérer le profil de l'utilisateur connecté (Route protégée)
export const getProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        if (!req.user?.id) {
            return handleResponse(res, 401, "Non autorisé.");
        }

        const user = await getUserByIdService(req.user.id);
        if (!user) {
            return handleResponse(res, 404, "Utilisateur introuvable.");
        }

        return handleResponse(res, 200, "Profil récupéré avec succès", user);
    } catch (err) {
        next(err);
    }
};

// Réinitialiser ou définir le mot de passe d'un utilisateur par son email
export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { email, password, role } = req.body || {};
    if (!email || !password) {
        return handleResponse(
            res,
            400,
            "Email et nouveau mot de passe sont requis (JSON)."
        );
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updated = await updatePasswordByEmailService(email, hashedPassword, role);
        if (!updated) {
            return handleResponse(res, 404, "Aucun utilisateur trouvé avec cet email.");
        }

        return handleResponse(
            res,
            200,
            "Mot de passe mis à jour avec succès 🔑",
            updated
        );
    } catch (err) {
        next(err);
    }
};
