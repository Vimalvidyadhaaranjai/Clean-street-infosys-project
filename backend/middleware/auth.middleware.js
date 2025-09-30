import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import config from "../.config/config.js";
const{ JWT_USER_SECRET, JWT_ADMIN_SECRET }= config; 

export const protect = async (req, res, next) => {
  let token;


  token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    let decoded;

    
    try {
      decoded = jwt.verify(token, JWT_USER_SECRET);
    } catch (err) {
      decoded = jwt.verify(token, JWT_ADMIN_SECRET);
    }

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
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
