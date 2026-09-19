const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const { verifyToken } = require("../middleware/auth");

// Public lead submission
router.post("/", leadController.createLead);

// Protected admin operations
router.get("/", verifyToken, leadController.getAllLeads);
router.patch("/:id/status", verifyToken, leadController.updateLeadStatus);
router.delete("/:id", verifyToken, leadController.deleteLead);

module.exports = router;

