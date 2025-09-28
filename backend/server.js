import express from "express";
import mongoose from "mongoose";
import config from "./.config/config.js"; // your config file
import authRoutes from "./routes/auth.routes.js"; // auth routes
import cors from "cors";
const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));


app.use(express.json());


app.use("/api/auth", authRoutes);




mongoose.connect(config.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(config.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${config.PORT}`);
});

