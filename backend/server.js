import express from "express";
import mongoose from "mongoose";
import config from "./.config/config.js"; // your config file
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import volunteerRoutes from "./routes/volunteer.routes.js";
import cors from "cors";
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import cookieParser from 'cookie-parser';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware must be defined before routes
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/user/profile/photo", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user/",userRoutes);
app.use("/api/complaints",complaintRoutes);
app.use("/api/volunteer", volunteerRoutes);
// Validate DB URI before attempting connection
if (!config.MONGO_URL || typeof config.MONGO_URL !== "string") {
  console.error("❌ MongoDB connection error: MONGO_URL is missing or invalid. Ensure it is defined in your environment or .env file.");
  process.exit(1);
}

mongoose.connect(config.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(config.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${config.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

