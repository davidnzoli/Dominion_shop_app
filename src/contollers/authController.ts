import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/env.js";
import {
    createUserService,
    getUserByEmailWithPasswordService,
    getUserByIdService,
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
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
        return handleResponse(
            res,
            400,
            "Tous les champs sont requis (name, email, password)."
        );
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await getUserByEmailWithPasswordService(email);
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

        // Enregistrement dans la base de données
        const newUser = await createUserService(name, email, hashedPassword, "user");

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
        // Recherche de l'utilisateur avec son hash de mot de passe
        const user = await getUserByEmailWithPasswordService(email);
        if (!user || !user.password) {
            return handleResponse(res, 401, "Email ou mot de passe incorrect.");
        }

        // Vérification de la correspondance du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return handleResponse(res, 401, "Email ou mot de passe incorrect.");
        }

        const signOptions: SignOptions = {
            expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
        };

        // Génération du token JWT valide 24h
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwt.secret,
            signOptions
        );

        // Exclure le hash du mot de passe de la réponse
        const { password: _, ...userSafe } = user;

        return handleResponse(res, 200, "Connexion réussie 🔑", {
            user: userSafe,
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
