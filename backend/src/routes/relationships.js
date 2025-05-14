import express from "express";
import { getRelationships, addRelationship, deleteRelationship } from "../controllers/relationship_controller.js";
import { authenticateTokenFromCookie } from "../middleware/authenticateTokenFromCookie.js";

const router = express.Router();

router.get("/", getRelationships);
router.post("/", authenticateTokenFromCookie, addRelationship);
router.delete("/", authenticateTokenFromCookie, deleteRelationship);

export default router;