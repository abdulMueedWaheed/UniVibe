import express from "express";
import { updateCoverPic, updateProfilePic, getUser } from "../controllers/user_controller.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/update-cover-pic", upload.single("file"), updateCoverPic);
router.post("/update-profile-pic", upload.single("file"), updateProfilePic);
router.get("/:user_id", getUser);

export default router;