const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["UNREAD", "READ"],
      default: "UNREAD"
    }
  },
  {
    timestamps: true
  }
);

const ContactMessage = mongoose.model(
  "ContactMessage",
  contactMessageSchema
);

module.exports = ContactMessage;