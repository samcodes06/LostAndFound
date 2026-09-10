const express = require("express");

const {
  createContactMessage,
  getAllContactMessages,
  markContactMessageAsRead
} = require("../controllers/contactController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// User - send message
router.post("/", createContactMessage);

// Admin - view all messages
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllContactMessages
);

// Admin - mark message as read
router.put(
  "/:id/read",
  authMiddleware,
  adminMiddleware,
  markContactMessageAsRead
);

module.exports = router;