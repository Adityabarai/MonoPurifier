const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken } = require("../middleware/auth");

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// ✅ Single route for Create + Update
router.post("/save", verifyToken, productController.addOrModifyProduct);

// Delete routes
router.delete("/:id", verifyToken, productController.deleteProduct);
router.post("/bulk-delete", verifyToken, productController.bulkDeleteProducts);

module.exports = router;