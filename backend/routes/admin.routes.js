import express from "express";
import {
  getAllComplaintsAdmin,
  getAllUsersAdmin,
  updateUserRoleAdmin,
  updateComplaintStatusAdmin,
  getAdminStats
} from "../controller/admin.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js"; // Import authorize

const router = express.Router();

// Protect all routes below & ensure only 'admin' role can access
router.use(protect);
router.use(authorize('admin')); // Apply admin authorization to all routes in this file

/**
 * @route   GET /api/admin/complaints
 * @desc    Get all complaints
 * @access  Private (Admin only)
 */
router.get("/complaints", getAllComplaintsAdmin);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get("/users", getAllUsersAdmin);

/**
 * @route   PATCH /api/admin/users/:userId/role
 * @desc    Update a user's role
 * @access  Private (Admin only)
 */
router.patch("/users/:userId/role", updateUserRoleAdmin);

/**
 * @route   PATCH /api/admin/complaints/:complaintId/status
 * @desc    Update a complaint's status
 * @access  Private (Admin only)
 */
router.patch("/complaints/:complaintId/status", updateComplaintStatusAdmin);

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Private (Admin only)
 */
router.get("/stats", getAdminStats);

export default router;