const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.get('/userdetails', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data and business profiles
    return res.status(200).json({ user, businessProfiles: user.businessProfiles });
  } catch (error) {
    console.error('Error fetching user data:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

router.get('/allusers', async (req, res) => {
  try {
    const users = await User.find();

    // Convert files to base64 and return a response with the transformed data
    const usersWithFiles = users.map(user => {
      const userObj = user.toObject();

      userObj.businessProfiles = userObj.businessProfiles.map(profile => {
        // Handle gstCertificate
        if (profile.gstCertificate && profile.gstCertificate.file) {
          if (profile.gstCertificate.file.buffer) {
            profile.gstCertificate.file = profile.gstCertificate.file.toString('base64');
          }
        }

        // Handle panCertificate
        if (profile.panCertificate && profile.panCertificate.file) {
          if (profile.panCertificate.file.buffer) {
            profile.panCertificate.file = profile.panCertificate.file.toString('base64');
          }
        }

        // Handle image files (e.g., profile image)
        if (profile.profileImage && profile.profileImage.file) {
          if (profile.profileImage.file.buffer) {
            profile.profileImage.file = profile.profileImage.file.toString('base64');
          }
        }

        return profile;
      });

      return userObj;
    });

    return res.status(200).json({ users: usersWithFiles });
  } catch (error) {
    console.error('Error fetching users data:', error);
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

// ✅ Update user personal + business details
router.put('/userdetails/update', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: 'Authorization header missing' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const { userData, businessProfiles } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update personal details
    if (userData) {
      user.name = userData.name || user.name;
      user.email = userData.email || user.email;
      user.location = userData.location || user.location;
    }

    // Replace old business profiles with updated ones
    if (businessProfiles && Array.isArray(businessProfiles)) {
      user.businessProfiles = businessProfiles;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    if (!res.headersSent)
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT /api/userdetails/update-password
router.put('/userdetails/update-password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Old password is incorrect" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    return res.json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

