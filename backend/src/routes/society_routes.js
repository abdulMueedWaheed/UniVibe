import express from 'express';
import {
  registerSociety,
  loginSociety,
  logoutSociety,
  getSociety, 
  getAllSocieties, 
  updateProfilePic, 
  updateCoverPic, 
  updateSocietyInfo ,
  changeSocietyPassword
} from '../controllers/society_controller.js';
import { upload } from '../middleware/multer.js';
import { societyAuth } from '../middleware/authenticateSociety.js';

const router = express.Router();

router.post('/register', registerSociety);
router.post('/login', loginSociety);
router.post('/logout', logoutSociety);

router.get('/:society_id', societyAuth, getSociety);
router.get('/', getAllSocieties);
router.put('/:society_id', societyAuth, updateSocietyInfo);
router.post('/update-profile-pic', upload.single("file"), updateProfilePic);
router.post('/update-cover-pic', upload.single("file"), updateCoverPic);
router.post('/:society_id/change-password', societyAuth, changeSocietyPassword);

export default router;