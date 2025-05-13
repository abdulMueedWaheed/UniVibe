import express from "express";
import { getLikes, addLike, deleteLike } from "../controllers/like_controller.js";

const router = express.Router();

// Get likes for a post
router.get("/", getLikes);

// Add a like to a post
router.post("/", addLike);

// Remove a like from a post
router.delete("/", deleteLike);

export default router; 