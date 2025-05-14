import express from "express";
import { getPosts,
	getPostsByUser,
	getPostsOfFollowedUsers,
	createPost,
	updatePost,
	deletePost
 } from "../controllers/post_controller.js";
import { upload } from '../middleware/multer.js';
import authenticateTokenFromCookie from "../middleware/authenticateTokenFromCookie.js";

const router = express.Router();

router.get('/', getPosts); // Fetch all posts
router.get('/:user_id', getPostsByUser); // Fetch posts by user ID
router.get("/followed/:user_id", getPostsOfFollowedUsers); // Fetch posts of followed users
router.post("/", upload.single("file"), createPost);
router.put("/:post_id", authenticateTokenFromCookie, upload.single("file"), updatePost);
router.delete("/:post_id", authenticateTokenFromCookie, deletePost);

export default router;