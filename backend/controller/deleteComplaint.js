

import Complaint from "../models/complaint.model.js";
import mongoose from "mongoose";

// ... your existing createComplaint, updateComplaint, etc. functions ...


// ADD THIS ENTIRE NEW FUNCTION AT THE END OF THE FILE
/**
 * @desc    Delete a complaint
 * @route   DELETE /api/complaints/:id
 * @access  Private
 */
export const deleteComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const userId = req.user._id;

    // Check for a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({ message: "Invalid complaint ID." });
    }

    const complaint = await Complaint.findById(complaintId);

    // Check if the complaint exists
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    // SECURITY CHECK: Ensure the user owns this complaint
    // Make sure your complaint model uses 'user_id' to store the user's ID
    if (complaint.user_id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Forbidden: You are not authorized to delete this report." });
    }

    // If all checks pass, delete the complaint
    await Complaint.findByIdAndDelete(complaintId);

    res.status(200).json({ success: true, message: "Complaint deleted successfully." });

  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ message: "Server error. Could not delete the complaint." });
  }
};