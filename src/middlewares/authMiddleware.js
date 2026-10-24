import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            status: 401,
            message: "Accès refusé. Token manquant ou format invalide (Bearer <token> requis).",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, email, role, iat, exp }
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
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
