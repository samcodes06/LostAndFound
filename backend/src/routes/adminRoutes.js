const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getAllUsers, getAllItems,deleteAnyItem,getAllClaims,getDashboardStats,updateUserStatus,getUserPosts} = require("../controllers/adminController");

router.get("/test", authMiddleware, adminMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Admin access granted",
    user: req.user
  });
});
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);
router.get(
  "/items",
  authMiddleware,
  adminMiddleware,
  getAllItems
);
router.delete(
  "/items/:id",
  authMiddleware,
  adminMiddleware,
  deleteAnyItem
);
router.get(
  "/claims",
  authMiddleware,
  adminMiddleware,
  getAllClaims
);
router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);
router.put(
  "/users/:id/status",
  authMiddleware,
  adminMiddleware,
  updateUserStatus
);
router.get(
  "/users/:id/posts",
  authMiddleware,
  adminMiddleware,
  getUserPosts
);

module.exports = router;