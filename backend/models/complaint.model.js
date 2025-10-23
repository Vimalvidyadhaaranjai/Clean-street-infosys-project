import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    // Link to the user who created the complaint
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // This creates a reference to the User model
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    // Corresponds to the 'type' dropdown in your form
    type: {
        type: String,
        required: [true, "Issue type is required"],
        enum: ["Garbage", "Road Damage", "Street Light", "Water Leakage"],
    },
    // Corresponds to the 'priority' dropdown
    priority: {
        type: String,
        required: [true, "Priority level is required"],
        enum: ["Low", "Medium", "High"],
        default: "Medium",
    },
    photo: {
      type: String, // URL to the uploaded image
      default: "",
    },
    // Storing location in GeoJSON format is standard practice
    location_coords: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    landmark: {
        type: String,
        default: "",
    },
    // Link to the volunteer/admin assigned to resolve the issue
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["received", "in_review", "resolved", "rejected"],
      default: "received",
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    downvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  
  {
    // Adds created_at and updated_at timestamps automatically
    timestamps: true,
  }
);

// Create an index for geospatial queries
complaintSchema.index({ location_coords: '2dsphere' });

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;