import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import Report from "../models/report.model.js";

const router = express.Router();

// Create new report
router.post("/create", protect, async (req, res) => {
  try {
    const { title, type, priority, address, landmark, description, latitude, longitude } = req.body;

    if (!title || !type || !priority || !address || !description || !latitude || !longitude) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const report = new Report({
      title,
      type,
      priority,
      address,
      landmark,
      description,
      latitude,
      longitude,
      user: req.user._id, // comes from protect middleware
    });

    await report.save();
    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
