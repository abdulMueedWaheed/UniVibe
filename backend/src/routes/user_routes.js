import express from "express";
import { updateCoverPic, updateProfilePic, getUser, getUsersForStories, searchUsers } from "../controllers/user_controller.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

// Search users
router.get('/search', searchUsers);

router.post("/update-cover-pic", upload.single("file"), updateCoverPic);
router.post("/update-profile-pic", upload.single("file"), updateProfilePic);
router.get("/:user_id", getUser);
router.get("/", getUsersForStories);



export default router;