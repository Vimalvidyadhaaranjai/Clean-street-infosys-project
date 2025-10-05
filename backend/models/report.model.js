import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  priority: { type: String, required: true },
  address: { type: String, required: true },
  landmark: { type: String },
  description: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema);
export default Report;
