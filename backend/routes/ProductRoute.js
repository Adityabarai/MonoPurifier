const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken } = require("../middleware/auth");

// Public routes (no authentication required)
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Protected routes (require authentication)
router.post("/", verifyToken, productController.createProduct);
router.put("/:id", verifyToken, productController.updateProduct);
router.delete("/:id", verifyToken, productController.deleteProduct);
router.delete("/", verifyToken, productController.bulkDeleteProducts);

// New routes for status and restore functionality
router.patch("/:id/status", verifyToken, productController.ProductStatus);

module.exports = router;