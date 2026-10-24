import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
    createUserService,
    getUserByEmailWithPasswordService,
    getUserByIdService,
} from "../modeles/userModel.js";

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data,
    });
};

// Inscription d'un nouvel utilisateur
export const register = async (req, res, next) => {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
        return handleResponse(
            res,
            400,
            "Les champs 'name', 'email' et 'password' sont requis."
        );
    }

    if (password.length < 6) {
        return handleResponse(
            res,
            400,
            "Le mot de passe doit comporter au moins 6 caractères."
        );
    }

    try {
        // Vérifier si l'email existe déjà
        const existingUser = await getUserByEmailWithPasswordService(email);
        if (existingUser) {
            return handleResponse(
                res,
                409,
                "Cet email est déjà associé à un compte existant."
            );
        }

        // Hachage sécurisé du mot de passe (sel à 10 tours)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Enregistrement dans la base de données
        const newUser = await createUserService(name, email, hashedPassword, "user");

        // Génération du token JWT valide 24h
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
        );

        handleResponse(res, 201, "Inscription réussie avec succès 🚀", {
            user: newUser,
            token,
            expiresIn: "24h",
        });
    } catch (err) {
        next(err);
    }
};

// Connexion d'un utilisateur existant
export const login = async (req, res, next) => {
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

        // Génération du token JWT valide 24h
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
        );

        // Exclure le hash du mot de passe de la réponse
        const { password: _, ...userSafe } = user;

        handleResponse(res, 200, "Connexion réussie 🔑", {
            user: userSafe,
            token,
            expiresIn: "24h",
        });
    } catch (err) {
        next(err);
    }
};

// Récupérer le profil de l'utilisateur connecté (Route protégée)
export const getProfile = async (req, res, next) => {
    try {
        const user = await getUserByIdService(req.user.id);
        if (!user) {
            return handleResponse(res, 404, "Utilisateur introuvable.");
        }
        handleResponse(res, 200, "Profil récupéré avec succès", user);
    } catch (err) {
        next(err);
    }
};
