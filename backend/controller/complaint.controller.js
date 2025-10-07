import Complaint from "../models/complaint.model.js";
import mongoose from "mongoose";

/**
 * @desc    Create a new complaint
 * @route   POST /api/complaints
 * @access  Private
 */
export const createComplaint = async (req, res) => {
  try {
    // Destructure all expected fields from the request body
    const {
      title,
      type,
      priority,
      address,
      landmark,
      description,
      latitude,
      longitude,
    } = req.body;

    // Basic validation to ensure all required fields are present
    if (
      !title || !type || !priority || !address || !description || !latitude || !longitude
    ) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    // The user ID is attached to `req.user` by the authentication middleware
    const userId = req.user._id;

    // Create a new complaint instance
    const newComplaint = new Complaint({
      user_id: userId,
      title,
      type,
      priority,
      address,
      landmark,
      description,
      location_coords: {
        type: "Point",
        // GeoJSON format requires [longitude, latitude]
        coordinates: [longitude, latitude],
      },
    });

    // Save the new complaint to the database
    const savedComplaint = await newComplaint.save();

    res.status(201).json({
        message: "Complaint submitted successfully!",
        data: savedComplaint
    });
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ message: "Server error. Could not create the report." });
  }
};

/**
 * @desc    Update an existing complaint
 * @route   PATCH /api/complaints/:id
 * @access  Private
 */
export const updateComplaint = async (req, res) => {
    try {
        const { id: complaintId } = req.params;
        const { status, assigned_to } = req.body;
        const user = req.user;

        // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(complaintId)) {
            return res.status(400).json({ message: "Invalid complaint ID." });
        }

        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found." });
        }

        let updateData = {};

        // If the user is an admin or volunteer, they can update status and assignment
        if (user.role === 'admin' || user.role === 'volunteer') {
            if (status) updateData.status = status;
            if (assigned_to) updateData.assigned_to = assigned_to;
        } else {
            // Regular user is trying to update
            // Check if the user is the original creator of the complaint
            if (complaint.user_id.toString() !== user._id.toString()) {
                return res.status(403).json({ message: "Forbidden. You are not authorized to update this complaint." });
            }
             // Allow user to edit their own report details if it's still 'received'
            if (complaint.status === 'received') {
                const { title, description, type, priority, address, landmark } = req.body;
                if(title) updateData.title = title;
                if(description) updateData.description = description;
                if(type) updateData.type = type;
                if(priority) updateData.priority = priority;
                if(address) updateData.address = address;
                if(landmark) updateData.landmark = landmark;

            } else {
                 return res.status(403).json({ message: "Forbidden. This complaint is already under review and cannot be edited." });
            }
        }
         // Check if there is anything to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update." });
        }

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { $set: updateData },
            { new: true, runValidators: true } // Return the updated document and run schema validation
        );

        res.status(200).json({
            message: "Complaint updated successfully!",
            data: updatedComplaint
        });

    } catch (error) {
        console.error("Error updating complaint:", error);
        res.status(500).json({ message: "Server error. Could not update the complaint." });
    }
};
/**
 * @desc    Get user's complaints and stats
 * @route   GET /api/complaints/my-reports
 * @access  Private
 */
export const getUserComplaints = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all complaints for the user
    const complaints = await Complaint.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .populate('assigned_to', 'name email');

    // Calculate statistics
    const totalReports = complaints.length;
    const resolvedReports = complaints.filter(c => c.status === 'resolved').length;
    const pendingReports = complaints.filter(c => c.status === 'received').length;
    const inProgressReports = complaints.filter(c => c.status === 'in_review').length;

    // Get recent complaints (last 3)
    const recentComplaints = complaints.slice(0, 3);

    res.status(200).json({
      success: true,
      data: {
        complaints: recentComplaints,
        stats: {
          totalReports,
          resolvedReports,
          pendingReports,
          inProgressReports
        }
      }
    });

  } catch (error) {
    console.error("Error fetching user complaints:", error);
    res.status(500).json({ message: "Server error. Could not fetch reports." });
  }
};

/**
 * @desc    Get all complaints for the user (paginated)
 * @route   GET /api/complaints/all
 * @access  Private
 */
export const getAllUserComplaints = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const complaints = await Complaint.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('assigned_to', 'name email');

    const totalComplaints = await Complaint.countDocuments({ user_id: userId });
    const totalPages = Math.ceil(totalComplaints / limit);

    res.status(200).json({
      success: true,
      data: {
        complaints,
        pagination: {
          currentPage: page,
          totalPages,
          totalComplaints,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error("Error fetching all user complaints:", error);
    res.status(500).json({ message: "Server error. Could not fetch all reports." });
  }
};