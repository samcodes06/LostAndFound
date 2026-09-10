const User = require("../models/userModel");
const Item = require("../models/itemModel");
const Claim = require("../models/claimModel");


const getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "postedBy",
          as: "posts"
        }
      },
      {
        $addFields: {
          totalPosts: { $size: "$posts" }
        }
      },
      {
        $project: {
          password: 0,
          posts: 0
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      }
    ]);

    return res.status(200).json({
      users
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("postedBy", "name username email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      items
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};
const deleteAnyItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    await item.deleteOne();

    return res.status(200).json({
      message: "Item deleted successfully by admin"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate({
        path: "item",
        populate: {
          path: "postedBy",
          select: "name username email phone"
        }
      })
      .populate("claimant", "name username email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      claims
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalItems = await Item.countDocuments();
    const lostItems = await Item.countDocuments({ type: "LOST" });
    const foundItems = await Item.countDocuments({ type: "FOUND" });
    const availableItems = await Item.countDocuments({ status: "AVAILABLE" });
    const returnedItems = await Item.countDocuments({ status: "RETURNED" });

    const totalClaims = await Claim.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: "PENDING" });
    const acceptedClaims = await Claim.countDocuments({ status: "ACCEPTED" });
    const rejectedClaims = await Claim.countDocuments({ status: "REJECTED" });

    return res.status(200).json({
      users: {
        total: totalUsers
      },

      items: {
        total: totalItems,
        lost: lostItems,
        found: foundItems,
        available: availableItems,
        returned: returnedItems
      },

      claims: {
        total: totalClaims,
        pending: pendingClaims,
        accepted: acceptedClaims,
        rejected: rejectedClaims
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be true or false"
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Prevent admin from changing own account status
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot change your own account status"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: false }
    );

    return res.status(200).json({
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};
// GET POSTS OF A SPECIFIC USER
const getUserPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name username");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const items = await Item.find({
      postedBy: req.params.id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      user,
      items
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  getAllUsers,
  getAllItems,
  deleteAnyItem,
  getAllClaims,
  getDashboardStats,
  updateUserStatus,
  getUserPosts
};