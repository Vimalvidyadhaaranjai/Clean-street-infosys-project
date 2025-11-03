// vimalvidyadhaaranjai/clean-street-infosys-project/Clean-street-infosys-project-4afda1af4d2e3c2fd6612df26770bfc5057750b4/backend/controller/complaint.controller.js
import Complaint from "../models/complaint.model.js";
import mongoose from "mongoose";

/**
 * @desc    Create a new complaint
 * @route   POST /api/complaints
 * @access  Private
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

    // ADDED: Handle the uploaded file from multer
    let photoUrl = null;
    if (req.file) {
      // Use Cloudinary URL
  
      photoUrl = req.file.path;
    }

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
      photo: photoUrl, // ADDED: Include the photo URL in the new complaint document
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
 * @desc    Update an existing complaint
 * @route   PATCH /api/complaints/:id
 * @access  Private
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
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (type) updateData.type = type;
        if (priority) updateData.priority = priority;
        if (address) updateData.address = address;
        if (landmark) updateData.landmark = landmark;

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
 * @desc    Get user's complaints and stats
 * @route   GET /api/complaints/my-reports
 * @access  Private
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

    // This now returns ALL complaints, not just 3. The frontend will slice it.
    res.status(200).json({
      success: true,
      data: {
        complaints: complaints, // Send all complaints
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
 * @desc    Get all complaints for the user (paginated)
 * @route   GET /api/complaints/all
 * @access  Private
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

/**
 * @desc   Get all complaints for the community view
 * @route   GET /api/complaints/community
 * @access   Public
 */
export const getCommunityComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({})
      .sort({ createdAt: -1 })
      .populate('user_id', 'name profilePhoto') // <<< MODIFIED: Added profilePhoto
      .populate('comments');

    res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    console.error("Error fetching community complaints:", error);
    res.status(500).json({ message: "Server error. Could not fetch reports." });
  }
};

/**
 * @desc   Upvote a complaint
 * @route   POST /api/complaints/:id/upvote
 * @access   Private
 */
export const upvoteComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({ message: "Invalid complaint ID." });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    // Check if user already upvoted
    const hasUpvoted = complaint.upvotes.includes(userId);
    const hasDownvoted = complaint.downvotes.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      complaint.upvotes = complaint.upvotes.filter(id => id.toString() !== userId.toString());
    } else {
      // Add upvote
      complaint.upvotes.push(userId);
      // Remove downvote if exists
      if (hasDownvoted) {
        complaint.downvotes = complaint.downvotes.filter(id => id.toString() !== userId.toString());
      }
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      data: {
        upvotes: complaint.upvotes.length,
        downvotes: complaint.downvotes.length,
        hasUpvoted: !hasUpvoted,
        hasDownvoted: false
      }
    });

  } catch (error) {
    console.error("Error upvoting complaint:", error);
    res.status(500).json({ message: "Server error. Could not upvote complaint." });
  }
};

/**
 * @desc   Downvote a complaint
 * @route   POST /api/complaints/:id/downvote
 * @access   Private
 */
export const downvoteComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({ message: "Invalid complaint ID." });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    // Check if user already downvoted
    const hasUpvoted = complaint.upvotes.includes(userId);
    const hasDownvoted = complaint.downvotes.includes(userId);

    if (hasDownvoted) {
      // Remove downvote
      complaint.downvotes = complaint.downvotes.filter(id => id.toString() !== userId.toString());
    } else {
      // Add downvote
      complaint.downvotes.push(userId);
      // Remove upvote if exists
      if (hasUpvoted) {
        complaint.upvotes = complaint.upvotes.filter(id => id.toString() !== userId.toString());
      }
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      data: {
        upvotes: complaint.upvotes.length,
        downvotes: complaint.downvotes.length,
        hasUpvoted: false,
        hasDownvoted: !hasDownvoted
      }
    });

  } catch (error) {
    console.error("Error downvoting complaint:", error);
    res.status(500).json({ message: "Server error. Could not downvote complaint." });
  }
};