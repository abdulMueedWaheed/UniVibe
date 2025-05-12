import express from "express";
import { getPosts, getPostsByUser, getPostsOfFollowedUsers, createPost } from "../controllers/post_controller.js";
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.get('/', getPosts); // Fetch all posts
router.get('/:user_id', getPostsByUser); // Fetch posts by user ID
router.get("/followed/:user_id", getPostsOfFollowedUsers); // Fetch posts of followed users
router.post("/", upload.single("file"), createPost);

export default router;