import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import config from "../.config/config.js";
const{ JWT_USER_SECRET, JWT_ADMIN_SECRET }= config; 

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      console.log("No token found in cookies");
      return res.status(401).json({ 
        message: "No authentication token found" 
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_USER_SECRET);
    } catch (userErr) {
      try {
        decoded = jwt.verify(token, JWT_ADMIN_SECRET);
      } catch (adminErr) {
        console.log("Token verification failed");
        return res.status(401).json({ 
          message: "Token verification failed" 
        });
      }
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("User not found with token ID");
      return res.status(401).json({ 
        message: "User not found" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ 
      message: "Authentication failed" 
    });
  }
};

// Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${
          req.user?.role || "unknown"
        }' is not authorized to access this route.`,
      });
    }
    next();
  };
};
