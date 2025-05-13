import express from "express";
import { login, register, logout} from "../controllers/auth_controller.js";
import authenticateTokenFromCookie from "../middleware/authenticateTokenFromCookie.js";

const router = express.Router();

// Public routes (no authentication required)
router.post('/login', login);
router.post('/register', register);

// Protected route (requires authentication)
router.post('/logout', authenticateTokenFromCookie, logout);

export default router;