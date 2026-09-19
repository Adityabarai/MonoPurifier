const express = require("express");
const router = express.Router();
const multer = require("multer");
const settingsController = require("../controllers/settingsController");
const { verifyToken } = require("../middleware/auth");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Public route to get the hero section image for the website
router.get("/hero-image", settingsController.getHeroImage);

// Protected routes to update and reset the hero section image
router.post(
  "/hero-image",
  verifyToken,
  upload.single("image"),
  settingsController.updateHeroImage
);

router.post(
  "/hero-image/reset",
  verifyToken,
  settingsController.resetHeroImage
);

module.exports = router;
