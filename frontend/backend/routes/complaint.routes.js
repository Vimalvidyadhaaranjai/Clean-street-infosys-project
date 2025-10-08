import express from "express";
import { createComplaint, updateComplaint, getUserComplaints, getAllUserComplaints, getComplaintStats } from "../controller/complaint.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/complaints
 * @desc    Create a new complaint
 * @access  Private (requires authentication)
 */
router.post("/create", protect, createComplaint);

/**
 * @route   PATCH /api/complaints/:id
 * @desc    Update an existing complaint
 * @access  Private (requires authentication)
 */
router.patch("/:id", protect, updateComplaint);
router.get("/my-reports", protect, getUserComplaints);
router.get("/all", protect, getAllUserComplaints);
router.get("/stats", protect, getComplaintStats);

export default router;