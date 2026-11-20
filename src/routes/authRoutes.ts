import express from "express";
import { register, login, getProfile, resetPassword } from "../contollers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.put("/reset-password", resetPassword);

// Route protégée par Token JWT
router.get("/me", verifyToken, getProfile);

export default router;
