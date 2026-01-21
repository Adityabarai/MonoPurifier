const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");


// Admin login (no auth required)
router.post("/login", adminController.adminLogin);

// Protected routes (require authentication)
// Add verifyToken middleware to routes that need authentication
// Example: router.post("/products", verifyToken, productController.manageProducts);

module.exports = router;
