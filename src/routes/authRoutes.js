import express from "express";
import { register, login, getProfile } from "../contollers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.post("/register", register);
router.post("/login", login);
router.post("/getProfile",getProfile)

// Route protégée par Token JWT
router.get("/me", verifyToken, getProfile);

export default router;
