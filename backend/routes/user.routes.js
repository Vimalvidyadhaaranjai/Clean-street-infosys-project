import express from "express";
import { getUserProfile,updateUserProfile,updateProfilePhoto,updatePassword } from "../controller/user.controller.js";
import {protect}from "../middleware/auth.middleware.js"
import { ProfilePhoto } from "../middleware/upload.middleware.js";
const router= express.Router();
router.route('/profile/photo').post(protect, ProfilePhoto.single('photo'), updateProfilePhoto)
router.use(express.json());
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);

router.route('/profile/password').post(protect,updatePassword);
export default router;