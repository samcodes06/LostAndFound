const express = require("express");

const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  markItemReturned,
  deleteItem,
  getMyItems,
  deleteItemImage,
  deleteItemVideo
} = require("../controllers/itemController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // IMPORTANT

const router = express.Router();

router.get("/items", getItems);

router.get("/items/my", authMiddleware, getMyItems);

router.get("/items/:id", getItemById);
router.post(
  "/items",
  authMiddleware,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 }
  ]),
  createItem
);

router.put(
  "/items/:id",
  authMiddleware,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 }
  ]),
  updateItem
);

router.put("/items/:id/return", authMiddleware, markItemReturned);

router.delete("/items/:id", authMiddleware, deleteItem);


router.delete(
  "/items/:id/images/:imageId",
  authMiddleware,
  deleteItemImage
);
router.delete(
  "/items/:id/video",
  authMiddleware,
  deleteItemVideo
);
module.exports = router;