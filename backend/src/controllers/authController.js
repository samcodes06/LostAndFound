const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");

const Item = require("../models/itemModel");
const Claim = require("../models/claimModel");
const Notification = require("../models/notificationModel");

// Generate an available username from name
const generateUsername = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        message: "Name is required"
      });
    }

    const baseName = name
      .toLowerCase()
      .replace(/\s+/g, "");

    let username;

    while (true) {
      const randomNumber = Math.floor(
        1000 + Math.random() * 9000
      );

      username = `${baseName}${randomNumber}`;

      const existingUser = await User.findOne({ username });

      if (!existingUser) break;
    }

    return res.status(200).json({
      username
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// Check username availability
const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        message: "Username is required"
      });
    }

    const existingUser = await User.findOne({
      username: username.toLowerCase()
    });

    return res.status(200).json({
      available: !existingUser
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// Register user
const registerUser = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      phone,
      profession,
      dateOfBirth,
      password
    } = req.body;

    if (
      !name ||
      !username ||
      !email ||
      !phone ||
      !profession ||
      !dateOfBirth ||
      !password
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { phone: phone }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or phone number is already registered"
      });
    }

    const existingUsername = await User.findOne({
      username: username.toLowerCase()
    });

    if (existingUsername) {
      return res.status(409).json({
        message: "Username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      username: username.toLowerCase(),
      email,
      phone,
      profession,
      dateOfBirth,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      message: "Registration successful",
      username: newUser.username
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// Login user
const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email or username and password are required"
      });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message:
          "Your account has been deactivated. Please contact the administrator."
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    return res.status(200).json({
      message: "Login successful",
      username: user.username,
      token: token
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// Get profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      user
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// Update profile
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      phone,
      profession,
      dateOfBirth,
      city
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    

    // Check username
    if (username && username.toLowerCase() !== user.username) {
      const existingUsername = await User.findOne({
        username: username.toLowerCase(),
        _id: { $ne: user._id }
      });

      if (existingUsername) {
        return res.status(409).json({
          message: "Username already exists"
        });
      }

      user.username = username.toLowerCase();
    }

    // Check email
    if (email && email.toLowerCase() !== user.email) {
      const existingEmail = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id }
      });

      if (existingEmail) {
        return res.status(409).json({
          message: "Email already exists"
        });
      }

      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (profession) user.profession = profession;
    if (city !== undefined) { user.city = city.trim();}

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// Change password
const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match"
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Current password is incorrect"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// Upload profile image
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please select an image"
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Delete old profile image
    if (user.profileImage?.publicId) {
      await cloudinary.uploader.destroy(
        user.profileImage.publicId
      );
    }

    // Upload new image
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "lost-and-found/profile-images"
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    user.profileImage = {
      url: result.secure_url,
      publicId: result.public_id
    };

    await user.save();

    return res.status(200).json({
      message: "Profile image updated successfully",
      profileImage: user.profileImage
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to upload profile image"
    });
  }
};


// Delete profile image
const deleteProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.profileImage?.publicId) {
      return res.status(400).json({
        message: "No profile image found"
      });
    }

    await cloudinary.uploader.destroy(
      user.profileImage.publicId
    );

    user.profileImage = {
      url: null,
      publicId: null
    };

    await user.save();

    return res.status(200).json({
      message: "Profile image removed successfully"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to remove profile image"
    });
  }
};


// DELETE MY ACCOUNT
const deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Delete profile image from Cloudinary
    if (user.profileImage?.publicId) {
      await cloudinary.uploader.destroy(
        user.profileImage.publicId
      );
    }

    // Find all items posted by user
    const items = await Item.find({
      postedBy: userId
    });

    // Delete item media from Cloudinary
    for (const item of items) {

      // Delete images
      if (item.images && item.images.length > 0) {
        for (const image of item.images) {
          if (image.publicId) {
            await cloudinary.uploader.destroy(
              image.publicId
            );
          }
        }
      }

      // Delete video
      if (item.video?.publicId) {
        await cloudinary.uploader.destroy(
          item.video.publicId,
          {
            resource_type: "video"
          }
        );
      }
    }

    // Delete claims related to user's posted items
    const itemIds = items.map((item) => item._id);

    if (itemIds.length > 0) {
      await Claim.deleteMany({
        item: { $in: itemIds }
      });
    }

    // Delete user's own claims
    await Claim.deleteMany({
      claimant: userId
    });

    // Delete user's items
    await Item.deleteMany({
      postedBy: userId
    });

    // Delete notifications received by user
    await Notification.deleteMany({
      recipient: userId
    });

    // Finally delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      message: "Your account and associated data were deleted successfully"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete account"
    });
  }
};


module.exports = {
  generateUsername,
  checkUsername,
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
  deleteProfileImage,
  deleteMyAccount
};