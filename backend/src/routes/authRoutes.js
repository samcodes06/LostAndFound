const express = require("express");

const upload = require("../middleware/uploadMiddleware");

const {
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
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Username
router.get("/generate-username", generateUsername);
router.get("/check-username", checkUsername);

// Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

// Password
router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

// Profile Image
router.put(
  "/profile-image",
  authMiddleware,
  upload.single("profileImage"),
  uploadProfileImage
);

router.delete(
  "/profile-image",
  authMiddleware,
  deleteProfileImage
);

// Delete own account
router.delete(
  "/delete-account",
  authMiddleware,
  deleteMyAccount
);

module.exports = router;