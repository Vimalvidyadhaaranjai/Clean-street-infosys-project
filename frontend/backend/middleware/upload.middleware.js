import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage definition for profile photos
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "cleanstreet/users",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `user_${req.user?._id || "anonymous"}_${Date.now()}`,
      transformation: [{ width: 512, height: 512, crop: "limit" }],
      // resource_type defaults to 'image'
    };
  },
});

export const upload = multer({ storage });
