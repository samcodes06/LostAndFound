const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true

    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    profession: {
      type: String,
      required: true,
      trim: true
    },
    city: {
  type: String,
  default: "",
  trim: true
},
    dateOfBirth: {
      type: Date,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    profileImage: {
      url: {
      type: String,
      default: null
      },
    publicId: {
      type: String,
      default: null
      }
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;