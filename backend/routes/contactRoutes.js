const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { protect } = require("../middlewares/authMiddleware");

// Public routes
router.get("/", contactController.getAllContacts);
router.get("/search", contactController.searchContacts);
router.get("/category/:category", contactController.getContactsByCategory);
router.get("/:id", contactController.getContactById);

// Protected routes (Admin only - add admin middleware if needed)
router.post("/", contactController.createContact);
router.put("/:id", contactController.updateContact);
router.delete("/:id", contactController.deleteContact);

module.exports = router;
