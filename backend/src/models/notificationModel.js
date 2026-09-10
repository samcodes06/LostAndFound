const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: [
        "CLAIM_SUBMITTED",
        "CLAIM_ACCEPTED",
        "CLAIM_REJECTED",
        "ITEM_RETURNED"
      ],
      required: true
    },

    relatedClaim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
      default: null
    },

    relatedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      default: null
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

module.exports = Notification;