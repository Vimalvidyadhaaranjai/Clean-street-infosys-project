import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../.config/config.js";
const { JWT_USER_SECRET, JWT_ADMIN_SECRET,NODE_ENV } = config;

// Function to generate token and set cookie
const generateTokenAndSetCookie = (res, user) => {
  const secret = user.role === "admin" ? JWT_ADMIN_SECRET : JWT_USER_SECRET;
  const token = jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure:NODE_ENV !== "development",
    sameSite: "strict", 
    maxAge: 60 * 60 * 1000,
  });
  return token;
};

//Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      location,
    });

    await newUser.save();

    const token = generateTokenAndSetCookie(res, newUser);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        location: newUser.location,
        profilePhoto:newUser.profilePhoto,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateTokenAndSetCookie(res, user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { 
        id: user._id,
         name: user.name, 
         email: user.email, 
         role: user.role, 
         location: user.location,
        profilePhoto:user.profilePhoto,
        },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};