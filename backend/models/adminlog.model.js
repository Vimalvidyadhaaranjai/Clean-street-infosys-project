import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false } 
);

const AdminLog = mongoose.model("AdminLog", adminLogSchema);

export default AdminLog;
