import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import config from "../.config/config.js";
const { JWT_USER_SECRET, JWT_ADMIN_SECRET }=config;
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
      role: role ||"user",
      location,
  
    });

    await newUser.save();

const secret = newUser.role === "admin" ? JWT_ADMIN_SECRET : JWT_USER_SECRET;

    const token = jwt.sign(
      { id: newUser._id, role:newUser.role },
      secret,
      { expiresIn: "1h" }
    );
     res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        location: newUser.location,
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
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
const secret = user.role === "admin" ? JWT_ADMIN_SECRET : JWT_USER_SECRET;
    const token = jwt.sign(
      { id: user._id, role: user.role },
      secret,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};