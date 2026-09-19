const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../controllers/productController");
const { verifyToken } = require("../middleware/auth");

const upload = multer({ storage: multer.memoryStorage() });

// Public product routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected admin routes
router.post("/save", verifyToken, productController.addOrModifyProduct);
router.post(
  "/upload-image",
  verifyToken,
  upload.single("image"),
  productController.uploadImage
);
router.delete("/:id", verifyToken, productController.deleteProduct);
router.delete("/", verifyToken, productController.bulkDeleteProducts);
router.post("/bulk-delete", verifyToken, productController.bulkDeleteProducts);
router.patch("/:id/status", verifyToken, productController.updateProductStatus);
router.patch("/:id/restore", verifyToken, productController.restoreProduct);

module.exports = router;