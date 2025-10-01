import express from "express";
import { getUserProfile,updateUserProfile,updateProfilePhoto,updatePassword } from "../controller/user.controller.js";
import {protect}from "../middleware/auth.middleware.js"
import { upload } from "../middleware/upload.middleware.js";
const router= express.Router();
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);
router.route('/profile/photo').post(protect, upload.single('photo'), updateProfilePhoto)
router.route('/profile/password').post(protect,updatePassword);
export default router;