import express from "express";
import { getAllUsers, getUserById } from "../controllers/user_controller.js";
import authenticateTokenFromCookie from "../middleware/authenticateTokenFromCookie.js";

const router = express.Router();

router.get("/", authenticateTokenFromCookie, async (req, res) => {
    const response = await getAllUsers();

    if (response.success) {
        res.status(200).json({ message: "Users fetched successfully", data: response.data });
    } else {
        res.status(500).json({ message: "Error fetching users", error: response.error });
    }
});

router.get("/:id", authenticateTokenFromCookie, async (req, res) => {
    const { id } = req.params;

    const response = await getUserById(id);

    if (response.success) {
        res.status(200).json({ message: "User fetched successfully", data: response.data });
    }
	
	else {
        res.status(404).json({ message: "Error fetching user", error: response.error });
    }
});

export default router;