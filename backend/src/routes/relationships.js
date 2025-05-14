import express from "express";
import { getRelationships, addRelationship, deleteRelationship } from "../controllers/relationship_controller.js";
import { authenticateTokenFromCookie } from "../middleware/authenticateTokenFromCookie.js";
import supabase from "../config/supabaseClient.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("[GET /relationships] Query:", req.query);
  next();
}, getRelationships);
router.post("/", authenticateTokenFromCookie, addRelationship);
router.delete("/", authenticateTokenFromCookie, deleteRelationship);

router.get("/following", async (req, res) => {
  const { followerUserId } = req.query;
  console.log("[GET /relationships/following] followerUserId:", followerUserId);
  const { data, error } = await supabase
    .from("user_relations")
    .select("followed_id")
    .eq("follower_id", followerUserId);

  if (error) {
    console.error("Supabase error in /following:", error);
    return res.status(500).json({ error });
  }
  console.log("Supabase data in /following:", data);
  res.status(200).json(data.map(r => r.followed_id));
});

export default router;