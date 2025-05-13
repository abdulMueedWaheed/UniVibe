import express from "express";
import { getComments, addComment } from "../controllers/comment_controller.js";

const router = express.Router();

router.get("/", getComments);      // GET /comments?postId=123
router.post("/", addComment);      // POST /comments

export default router;