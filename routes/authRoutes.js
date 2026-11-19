
import express from "express";

import {
    register,
    login,
    getCurrentUser,
    logout,
    updateProfile,
    updatePassword
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", getCurrentUser);
router.post("/logout", logout);
router.put("/profile", updateProfile);
router.put("/password", updatePassword);

export default router;
