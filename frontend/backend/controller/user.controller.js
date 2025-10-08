import User from "../models/user.model.js";
import bcrypt from "bcrypt";
export const getUserProfile = async (req, res) => {
  try { 
    const user = await User.findById(req.user._id).select("-password"); // Exclude password from the result

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.location = req.body.location || user.location;
    if (req.body.profilePhoto) {
      user.profilePhoto = req.body.profilePhoto;
    }

    if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      location: updatedUser.location,
      role: updatedUser.role,
      profilePhoto: updatedUser.profilePhoto,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateProfilePhoto = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }
        
        user.profilePhoto = req.file.path;
        await user.save();

        res.status(200).json({
            message: "Profile photo updated successfully",
            profilePhoto: user.profilePhoto,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                location: user.location,
                profilePhoto: user.profilePhoto,
            }
        });

    } catch (error) {
        console.error("Error updating profile photo:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Please provide both old and new passwords." });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

