const Claim = require("../models/claimModel");
const Item = require("../models/itemModel");
const Notification = require("../models/notificationModel");

// CREATE CLAIM
const createClaim = async (req, res) => {
  try {
    const { description, contactInfo } = req.body;
    const itemId = req.params.itemId;

    // Validate required fields
    if (!description || !contactInfo) {
      return res.status(400).json({
        message: "Description and contact information are required"
      });
    }

    // Find item
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    // Owner cannot claim own item
    if (item.postedBy.toString() === req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot claim your own item"
      });
    }

    // Cannot claim returned item
    if (item.status === "RETURNED") {
      return res.status(400).json({
        message: "This item has already been returned"
      });
    }

    // Prevent duplicate pending claims
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimant: req.user._id,
      status: "PENDING"
    });

    if (existingClaim) {
      return res.status(400).json({
        message: "You already have a pending claim for this item"
      });
    }

    // Create claim
    const claim = await Claim.create({
      item: itemId,
      claimant: req.user._id,
      description,
      contactInfo
    });

    // Notify item owner
    await Notification.create({
      recipient: item.postedBy,
      message: `Someone has submitted a claim for your item: ${item.itemName}`,
      type: "CLAIM_SUBMITTED",
      relatedItem: item._id,
      relatedClaim: claim._id
    });

    return res.status(201).json({
      message: "Claim submitted successfully",
      claim
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// GET MY CLAIMS
const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({
      claimant: req.user._id
    })
      .populate({
        path: "item",
        populate: {
          path: "postedBy",
          select: "name username email phone"
        }
      })
      .sort({ createdAt: -1 });

    const safeClaims = claims.map((claim) => {
      const claimObject = claim.toObject();

      // Show contact details only for accepted claims
      // and only while item is not returned
      if (
        claim.status !== "ACCEPTED" ||
        (claimObject.item && claimObject.item.status === "RETURNED")
      ) {
        if (claimObject.item && claimObject.item.postedBy) {
          delete claimObject.item.postedBy.email;
          delete claimObject.item.postedBy.phone;
        }

        delete claimObject.contactInfo;
      }

      return claimObject;
    });

    return res.status(200).json({
      claims: safeClaims
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// GET RECEIVED CLAIMS
const getReceivedClaims = async (req, res) => {
  try {
    // Get user's items
    const items = await Item.find({
      postedBy: req.user._id
    }).select("_id");

    const itemIds = items.map((item) => item._id);

    // Get claims for those items
    const claims = await Claim.find({
      item: { $in: itemIds }
    })
      .populate("item")
      .populate("claimant", "name username email phone")
      .sort({ createdAt: -1 });

    const safeClaims = claims.map((claim) => {
      const claimObject = claim.toObject();

      // Hide claimant contact details unless accepted
      if (claim.status !== "ACCEPTED") {
        delete claimObject.contactInfo;

        if (claimObject.claimant) {
          delete claimObject.claimant.email;
          delete claimObject.claimant.phone;
        }
      }

      return claimObject;
    });

    return res.status(200).json({
      claims: safeClaims
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// REJECT CLAIM
const rejectClaim = async (req, res) => {
  const session = await Claim.startSession();

  try {
    session.startTransaction();

    const claim = await Claim.findById(req.params.id)
      .populate("item")
      .session(session);

    if (!claim) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Claim not found"
      });
    }

    // Check item owner
    if (claim.item.postedBy.toString() !== req.user._id.toString()) {
      await session.abortTransaction();

      return res.status(403).json({
        message: "You are not allowed to reject this claim"
      });
    }

    // Only pending claims can be rejected
    if (claim.status !== "PENDING") {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Only pending claims can be rejected"
      });
    }

    // Reject claim
    claim.status = "REJECTED";
    await claim.save({ session });

    // Notify claimant
    await Notification.create(
      [
        {
          recipient: claim.claimant,
          message: `Your claim for "${claim.item.itemName}" has been rejected`,
          type: "CLAIM_REJECTED",
          relatedItem: claim.item._id,
          relatedClaim: claim._id
        }
      ],
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json({
      message: "Claim rejected successfully",
      claim
    });

  } catch (error) {
    await session.abortTransaction();
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });

  } finally {
    session.endSession();
  }
};


// ACCEPT CLAIM
const acceptClaim = async (req, res) => {
  const session = await Claim.startSession();

  try {
    session.startTransaction();

    const claim = await Claim.findById(req.params.id)
      .populate("item")
      .populate(
        "claimant",
        "name username email phone profileImage"
      )
      .session(session);

    if (!claim) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Claim not found"
      });
    }

    // Check item owner
    if (claim.item.postedBy.toString() !== req.user._id.toString()) {
      await session.abortTransaction();

      return res.status(403).json({
        message: "You are not allowed to accept this claim"
      });
    }

    // Only pending claims can be accepted
    if (claim.status !== "PENDING") {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Only pending claims can be accepted"
      });
    }

    // Accept ONLY this claim
    claim.status = "ACCEPTED";
    await claim.save({ session });

    // IMPORTANT:
    // Other pending claims remain pending.
    // They will be handled when the item is marked as returned.

    // Notify accepted claimant
    await Notification.create(
      [
        {
          recipient: claim.claimant._id,
          message: `Your claim for "${claim.item.itemName}" has been accepted`,
          type: "CLAIM_ACCEPTED",
          relatedItem: claim.item._id,
          relatedClaim: claim._id
        }
      ],
      { session }
    );

    await session.commitTransaction();

    return res.status(200).json({
      message: "Claim accepted successfully",
      claim
    });

  } catch (error) {
    await session.abortTransaction();
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });

  } finally {
    session.endSession();
  }
};

// GET CLAIM DETAILS
const getClaimDetails = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate({
        path: "item",
        populate: {
          path: "postedBy",
          select: "name username email phone"
        }
      })
      .populate(
        "claimant",
        "name username email phone"
      );

    if (!claim) {
      return res.status(404).json({
        message: "Claim not found"
      });
    }

    const userId = req.user._id.toString();

    const claimantId = claim.claimant?._id.toString();

    const ownerId =
      claim.item?.postedBy?._id.toString();

    // Allow both claimant and item owner
    if (
      userId !== claimantId &&
      userId !== ownerId
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this claim"
      });
    }

    return res.status(200).json({
      claim
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  createClaim,
  getMyClaims,
  getClaimDetails,
  getReceivedClaims,
  rejectClaim,
  acceptClaim
};