import Complaint from "../models/complaint.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

/**
 * @desc    Get all complaints for admin view
 * @route   GET /api/admin/complaints
 * @access  Private (Admin only)
 */
export const getAllComplaintsAdmin = async (req, res) => {
  try {
    const complaints = await Complaint.find({})
      .sort({ createdAt: -1 })
      .populate('user_id', 'name email') // User who reported
      .populate('assigned_to', 'name email'); // User assigned (volunteer/admin)

    res.status(200).json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    console.error("Error fetching all complaints for admin:", error);
    res.status(500).json({ message: "Server error fetching complaints." });
  }
};

/**
 * @desc    Get all users for admin view
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 }); // Exclude passwords
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error("Error fetching all users for admin:", error);
    res.status(500).json({ message: "Server error fetching users." });
  }
};

/**
 * @desc    Update user role by Admin
 * @route   PATCH /api/admin/users/:userId/role
 * @access  Private (Admin only)
 */
export const updateUserRoleAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const validRoles = ["user", "volunteer", "admin"];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prevent admin from changing their own role? (Optional safeguard)
    // if (user._id.toString() === req.user._id.toString() && user.role === 'admin' && role !== 'admin') {
    //   return res.status(400).json({ message: "Admins cannot change their own role." });
    // }

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, message: `User role updated to ${role}.` });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Server error updating role." });
  }
};

/**
 * @desc    Get basic dashboard stats for Admin
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalComplaints = await Complaint.countDocuments();
        const pendingComplaints = await Complaint.countDocuments({ status: 'received' });
        const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalComplaints,
                pendingComplaints,
                resolvedComplaints,
            },
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Server error fetching stats." });
    }
};

// Add other admin functions here later (e.g., delete user, generate reports)