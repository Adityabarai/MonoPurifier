const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../controllers/productController");
const { verifyToken } = require("../middleware/auth");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/save", verifyToken, productController.addOrModifyProduct);
router.post("/upload-image", verifyToken, upload.single("image"), productController.uploadImage);
router.delete("/:id", verifyToken, productController.deleteProduct);
router.post("/bulk-delete", verifyToken, productController.bulkDeleteProducts);

module.exports = router;