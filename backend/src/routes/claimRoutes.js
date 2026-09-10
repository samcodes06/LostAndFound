const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createClaim,
  getMyClaims,
  getReceivedClaims,
  getClaimDetails,
  rejectClaim,
  acceptClaim
} = require("../controllers/claimController");

// CREATE CLAIM
router.post(
  "/claims/:itemId",
  authMiddleware,
  createClaim
);

// GET MY CLAIMS
router.get(
  "/claims/my",
  authMiddleware,
  getMyClaims
);

// GET RECEIVED CLAIMS
// MUST COME BEFORE /claims/:id
router.get(
  "/claims/received",
  authMiddleware,
  getReceivedClaims
);

// GET SINGLE CLAIM DETAILS
// Keep this AFTER specific routes
router.get(
  "/claims/:id",
  authMiddleware,
  getClaimDetails
);

// REJECT CLAIM
router.put(
  "/claims/:id/reject",
  authMiddleware,
  rejectClaim
);

// ACCEPT CLAIM
router.put(
  "/claims/:id/accept",
  authMiddleware,
  acceptClaim
);

module.exports = router;