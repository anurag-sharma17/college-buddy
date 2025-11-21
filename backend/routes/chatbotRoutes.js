const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");
const authMiddleware = require("../middlewares/authMiddleware");

// Chat endpoint - protected route (requires authentication)
router.post("/chat", authMiddleware, chatbotController.chat);

// Health check endpoint - public
router.get("/health", chatbotController.healthCheck);

module.exports = router;
