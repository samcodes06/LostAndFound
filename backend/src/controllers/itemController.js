const Item = require("../models/itemModel");
const Claim = require("../models/claimModel");
const Notification = require("../models/notificationModel");
const cloudinary = require("../config/cloudinary");

// CREATE ITEM
const createItem = async (req, res) => {
  try {
    const {
      type,
      category,
      itemName,
      description,
      color,
      location,
      area,
      specificPlace
    } = req.body;

    if (
      !type ||
      !category ||
      !itemName ||
      !description ||
      !location ||
      !area ||
      !specificPlace
    ) {
      return res.status(400).json({
        message: "Please provide all required fields"
      });
    }

    // Upload images
    const images = [];

    if (req.files && req.files.images && req.files.images.length > 0) {
      for (const file of req.files.images) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "lost-and-found/items"
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(file.buffer);
        });

        images.push({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    }

    // Upload video
    let videoData;

    if (req.files && req.files.video && req.files.video.length > 0) {
      const file = req.files.video[0];

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "lost-and-found/videos",
            resource_type: "video"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(file.buffer);
      });

      videoData = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    // Create item
    const item = await Item.create({
      type,
      category,
      itemName,
      description,
      color,
      location,
      area,
      specificPlace,
      images,
      video: videoData,
      postedBy: req.user._id
    });

    return res.status(201).json({
      message: "Item created successfully",
      item
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// GET ALL ITEMS
// GET ALL ITEMS WITH FILTERS
const getItems = async (req, res) => {
  try {
    const {
      type,
      category,
      location,
      area,
      specificPlace,
      color,
      status,
      search
    } = req.query;

    const filter = {};

    // Only add filters that the user selected
    if (type) filter.type = type;

    if (category) filter.category = category;

    // Case-insensitive location filter
    if (location) {
      filter.location = {
        $regex: `^${location.trim()}$`,
        $options: "i"
      };
    }

    if (area) filter.area = area;

    if (specificPlace) {
      filter.specificPlace = specificPlace;
    }

    if (color) filter.color = color;

    if (status) filter.status = status;

    // Search across all relevant fields
    if (search) {
      filter.$or = [
        { itemName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { color: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
        { specificPlace: { $regex: search, $options: "i" } }
      ];
    }

    const items = await Item.find(filter)
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


// GET ITEM BY ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("postedBy", "name username");

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    return res.status(200).json({
      item
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

// UPDATE ITEM
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this item"
      });
    }

    if (item.status === "RETURNED") {
      return res.status(400).json({
        message: "Returned items cannot be updated"
      });
    }

    const {
      type,
      category,
      itemName,
      description,
      color,
      location,
      area,
      specificPlace
    } = req.body;

    // Update text fields
    item.type = type ?? item.type;
    item.category = category ?? item.category;
    item.itemName = itemName ?? item.itemName;
    item.description = description ?? item.description;
    item.color = color ?? item.color;
    item.location = location ?? item.location;
    item.area = area ?? item.area;
    item.specificPlace = specificPlace ?? item.specificPlace;


    // ADD NEW IMAGES
    if (
      req.files &&
      req.files.images &&
      req.files.images.length > 0
    ) {
      if (item.images.length + req.files.images.length > 5) {
        return res.status(400).json({
          message: "Maximum 5 images allowed per item"
        });
      }

      const newImages = [];

      for (const file of req.files.images) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "lost-and-found/items"
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          uploadStream.end(file.buffer);
        });

        newImages.push({
          url: result.secure_url,
          publicId: result.public_id
        });
      }

      item.images.push(...newImages);
    }


    // REPLACE VIDEO
    if (
      req.files &&
      req.files.video &&
      req.files.video.length > 0
    ) {
      // Delete old video
      if (item.video && item.video.publicId) {
        await cloudinary.uploader.destroy(
          item.video.publicId,
          { resource_type: "video" }
        );
      }

      const file = req.files.video[0];

      // Upload new video
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "lost-and-found/videos",
            resource_type: "video"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(file.buffer);
      });

      item.video = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    await item.save();

    return res.status(200).json({
      message: "Item updated successfully",
      item
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// DELETE ITEM
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this item"
      });
    }

    // Delete images from Cloudinary
    if (item.images && item.images.length > 0) {
      for (const image of item.images) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    // Delete video from Cloudinary
    if (item.video && item.video.publicId) {
      await cloudinary.uploader.destroy(
        item.video.publicId,
        { resource_type: "video" }
      );
    }

    await item.deleteOne();

    return res.status(200).json({
      message: "Item and associated media deleted successfully"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

// MARK ITEM AS RETURNED
const markItemReturned = async (req, res) => {
  const session = await Item.startSession();

  try {
    session.startTransaction();

    const item = await Item.findById(req.params.id).session(session);

    if (!item) {
      await session.abortTransaction();
      return res.status(404).json({
        message: "Item not found"
      });
    }

    // Check ownership
    if (item.postedBy.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({
        message: "You are not allowed to mark this item as returned"
      });
    }

    if (item.status === "RETURNED") {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Item is already marked as returned"
      });
    }

    // Find accepted claim
    const acceptedClaim = await Claim.findOne({
      item: item._id,
      status: "ACCEPTED"
    }).session(session);

    if (!acceptedClaim) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Item cannot be marked as returned until a claim is accepted"
      });
    }

    // Mark item as returned
    item.status = "RETURNED";
    await item.save({ session });

    // Notify accepted claimant
    await Notification.create(
      [
        {
          recipient: acceptedClaim.claimant,
          message: `Your claimed item "${item.itemName}" has been marked as returned`,
          type: "ITEM_RETURNED",
          relatedItem: item._id,
          relatedClaim: acceptedClaim._id
        }
      ],
      { session }
    );

    // Find all remaining pending claims
    const pendingClaims = await Claim.find({
      item: item._id,
      status: "PENDING"
    }).session(session);

    // Reject remaining pending claims
    for (const claim of pendingClaims) {
      claim.status = "REJECTED";
      await claim.save({ session });

      // Notify rejected claimant
      await Notification.create(
        [
          {
            recipient: claim.claimant,
            message: `Your claim for "${item.itemName}" was closed because the item has been returned to another claimant`,
            type: "CLAIM_REJECTED",
            relatedItem: item._id,
            relatedClaim: claim._id
          }
        ],
        { session }
      );
    }

    await session.commitTransaction();

    return res.status(200).json({
      message:
        "Item marked as returned and remaining claims closed successfully",
      item
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

// DELETE IMAGE
const deleteItemImage = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this image"
      });
    }

    const image = item.images.find(
      (img) => img._id.toString() === req.params.imageId
    );

    if (!image) {
      return res.status(404).json({
        message: "Image not found"
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // Remove from MongoDB
    item.images = item.images.filter(
      (img) => img._id.toString() !== req.params.imageId
    );

    await item.save();

    return res.status(200).json({
      message: "Image deleted successfully",
      item
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};


// DELETE ITEM VIDEO
const deleteItemVideo = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this video"
      });
    }

    if (!item.video || !item.video.publicId) {
      return res.status(404).json({
        message: "No video found for this item"
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(
      item.video.publicId,
      { resource_type: "video" }
    );

    // Remove video
    item.video = undefined;

    await item.save();

    return res.status(200).json({
      message: "Video deleted successfully",
      item
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error"
    });
  }
};
// GET MY ITEMS
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({
      postedBy: req.user._id
    }).sort({ createdAt: -1 });

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


module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  markItemReturned,
  getMyItems,
  deleteItemImage,
  deleteItemVideo
};