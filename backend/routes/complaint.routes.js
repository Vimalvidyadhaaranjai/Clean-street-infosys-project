// backend/routes/complaint.routes.js

import express from "express";
 // 1. Import multer
import { createComplaint, updateComplaint, getUserComplaints, getAllUserComplaints, deleteComplaint, getCommunityComplaints, upvoteComplaint, downvoteComplaint} from "../controller/complaint.controller.js";
import { protect } from "../middleware/auth.middleware.js";

import { uploadComplaintPhoto } from "../middleware/upload.middleware.js";
const router = express.Router();

// 2. Configure multer to save files to an 'uploads/' directory


/**
 * @route   POST /api/complaints/create
 * @desc    Create a new complaint
 * @access  Private (requires authentication)
 */
// 3. Add the multer middleware here. 
// It looks for a single file in a form field named 'photo'.
router.post("/create", protect, uploadComplaintPhoto.single('photo'), createComplaint);


/**
 * @route   PATCH /api/complaints/:id
 * @desc    Update an existing complaint
 * @access  Private (requires authentication)
 */
router.patch("/:id", protect, updateComplaint);
router.get("/my-reports", protect, getUserComplaints);
router.get("/all", protect, getAllUserComplaints);

// 2. ADD THIS NEW ROUTE FOR DELETING A COMPLAINT
/**
 * @route   DELETE /api/complaints/:id
 * @desc    Delete a user's own complaint
 * @access  Private
 */
router.delete("/:id", protect, deleteComplaint);

// ... (keep all your existing routes)

/**
 * @route   GET /api/complaints/community
 * @desc    Get all complaints for public view
 * @access  Public
 */
// ADD THIS NEW LINE AT THE END OF THE FILE
router.get("/community", getCommunityComplaints);

/**
 * @route   POST /api/complaints/:id/upvote
 * @desc    Upvote a complaint
 * @access  Private
 */
router.post("/:id/upvote", protect, upvoteComplaint);

/**
 * @route   POST /api/complaints/:id/downvote
 * @desc    Downvote a complaint
 * @access  Private
 */
router.post("/:id/downvote", protect, downvoteComplaint);

export default router;