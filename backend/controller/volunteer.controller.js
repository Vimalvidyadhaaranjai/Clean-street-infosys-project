import Complaint from "../models/complaint.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

/**
 * Helper function to get coordinates from location string using Nominatim (OpenStreetMap)
 * Free geocoding service, no API key required
 */
const getCoordinatesFromLocation = async (location) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'CleanStreetApp/1.0'
        }
      }
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * @desc    Get nearby complaints for volunteer based on their location string
 * @route   GET /api/volunteer/nearby-complaints
 * @access  Private (Volunteer only)
 */
export const getNearbyComplaints = async (req, res) => {
  try {
    const volunteerId = req.user._id;
    const volunteer = await User.findById(volunteerId);

    if (!volunteer || volunteer.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied. Volunteers only." });
    }

    // Check if volunteer has location
    if (!volunteer.location) {
      return res.status(400).json({ 
        message: "Volunteer location not set. Please update your profile with a location." 
      });
    }

    // Get coordinates from volunteer's location string
    const volunteerCoords = await getCoordinatesFromLocation(volunteer.location);
    
    if (!volunteerCoords) {
      return res.status(400).json({ 
        message: "Could not geocode volunteer location. Please ensure location is valid." 
      });
    }

    const maxDistance = parseInt(req.query.maxDistance) || 70; // Default 70km radius

    // Get all complaints that are not resolved or rejected
    const allComplaints = await Complaint.find({
      status: { $in: ["received", "in_review"] }
    })
    .populate('user_id', 'name email')
    .populate('assigned_to', 'name email')
    .sort({ createdAt: -1 });

    // Filter complaints by distance
    const nearbyComplaints = allComplaints.filter(complaint => {
      const complaintLat = complaint.location_coords.coordinates[1];
      const complaintLon = complaint.location_coords.coordinates[0];
      const distance = calculateDistance(
        volunteerCoords.latitude,
        volunteerCoords.longitude,
        complaintLat,
        complaintLon
      );
      return distance <= maxDistance;
    }).map(complaint => {
      const complaintLat = complaint.location_coords.coordinates[1];
      const complaintLon = complaint.location_coords.coordinates[0];
      const distance = calculateDistance(
        volunteerCoords.latitude,
        volunteerCoords.longitude,
        complaintLat,
        complaintLon
      );
      return {
        ...complaint.toObject(),
        distance: distance.toFixed(2) // Distance in km
      };
    });

    res.status(200).json({
      success: true,
      count: nearbyComplaints.length,
      data: nearbyComplaints,
      volunteerLocation: volunteer.location,
      volunteerCoordinates: volunteerCoords
    });

  } catch (error) {
    console.error("Error fetching nearby complaints:", error);
    res.status(500).json({ message: "Server error. Could not fetch nearby complaints." });
  }
};

/**
 * @desc    Get complaints assigned to the volunteer
 * @route   GET /api/volunteer/my-assignments
 * @access  Private (Volunteer only)
 */
export const getMyAssignments = async (req, res) => {
  try {
    const volunteerId = req.user._id;

    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied. Volunteers only." });
    }

    // Find all complaints assigned to this volunteer
    const assignments = await Complaint.find({ 
      assigned_to: volunteerId 
    })
    .populate('user_id', 'name email')
    .sort({ createdAt: -1 });

    // Calculate statistics
    const totalAssignments = assignments.length;
    const pendingAssignments = assignments.filter(c => c.status === 'received').length;
    const inProgressAssignments = assignments.filter(c => c.status === 'in_review').length;
    const resolvedAssignments = assignments.filter(c => c.status === 'resolved').length;

    res.status(200).json({
      success: true,
      data: {
        assignments,
        stats: {
          totalAssignments,
          pendingAssignments,
          inProgressAssignments,
          resolvedAssignments
        }
      }
    });

  } catch (error) {
    console.error("Error fetching volunteer assignments:", error);
    res.status(500).json({ message: "Server error. Could not fetch assignments." });
  }
};

/**
 * @desc    Assign complaint to volunteer (self-assignment)
 * @route   POST /api/volunteer/assign/:complaintId
 * @access  Private (Volunteer only)
 */
export const assignComplaintToSelf = async (req, res) => {
  try {
    const volunteerId = req.user._id;
    const { complaintId } = req.params;

    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied. Volunteers only." });
    }

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({ message: "Invalid complaint ID." });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    // Check if already assigned
    if (complaint.assigned_to) {
      return res.status(400).json({ 
        message: "This complaint is already assigned to another volunteer." 
      });
    }

    // Assign to volunteer and update status
    complaint.assigned_to = volunteerId;
    complaint.status = "in_review";
    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaintId)
      .populate('user_id', 'name email')
      .populate('assigned_to', 'name email');

    res.status(200).json({
      success: true,
      message: "Complaint assigned successfully!",
      data: updatedComplaint
    });

  } catch (error) {
    console.error("Error assigning complaint:", error);
    res.status(500).json({ message: "Server error. Could not assign complaint." });
  }
};

/**
 * @desc    Update complaint status by volunteer
 * @route   PATCH /api/volunteer/update-status/:complaintId
 * @access  Private (Volunteer only)
 */
export const updateComplaintStatus = async (req, res) => {
  try {
    const volunteerId = req.user._id;
    const { complaintId } = req.params;
    const { status } = req.body;

    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied. Volunteers only." });
    }

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({ message: "Invalid complaint ID." });
    }

    // Validate status
    const validStatuses = ["received", "in_review", "resolved", "rejected"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Invalid status. Must be one of: received, in_review, resolved, rejected" 
      });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    // Check if complaint is assigned to this volunteer
    if (!complaint.assigned_to || complaint.assigned_to.toString() !== volunteerId.toString()) {
      return res.status(403).json({ 
        message: "You can only update complaints assigned to you." 
      });
    }

    // Update status
    complaint.status = status;
    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaintId)
      .populate('user_id', 'name email')
      .populate('assigned_to', 'name email');

    res.status(200).json({
      success: true,
      message: `Complaint status updated to ${status}!`,
      data: updatedComplaint
    });

  } catch (error) {
    console.error("Error updating complaint status:", error);
    res.status(500).json({ message: "Server error. Could not update status." });
  }
};

/**
 * @desc    Unassign complaint from volunteer
 * @route   POST /api/volunteer/unassign/:complaintId
 * @access  Private (Volunteer only)
 */
export const unassignComplaint = async (req, res) => {
  try {
    const volunteerId = req.user._id;
    const { complaintId } = req.params;

    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Access denied. Volunteers only." });
    }

    if (!mongoose.Types.ObjectId.isValid(complaintId)) {
      return res.status(400).json({ message: "Invalid complaint ID." });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    // Check if complaint is assigned to this volunteer
    if (!complaint.assigned_to || complaint.assigned_to.toString() !== volunteerId.toString()) {
      return res.status(403).json({ 
        message: "You can only unassign complaints assigned to you." 
      });
    }

    // Unassign and reset status
    complaint.assigned_to = null;
    complaint.status = "received";
    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint unassigned successfully!",
      data: complaint
    });

  } catch (error) {
    console.error("Error unassigning complaint:", error);
    res.status(500).json({ message: "Server error. Could not unassign complaint." });
  }
};
