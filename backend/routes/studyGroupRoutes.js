const express = require("express");
const router = express.Router();
const studyGroupController = require("../controllers/studyGroupController");
const authMiddleware = require("../middlewares/authMiddleware");

// Public routes
router.get("/", studyGroupController.getAllStudyGroups);

// Protected routes (require authentication)
router.post("/", authMiddleware, studyGroupController.createStudyGroup);
router.get(
  "/user/my-groups",
  authMiddleware,
  studyGroupController.getUserStudyGroups
);
router.get("/:id", studyGroupController.getStudyGroupById);
router.post("/:id/join", authMiddleware, studyGroupController.joinStudyGroup);
router.post("/:id/leave", authMiddleware, studyGroupController.leaveStudyGroup);
router.put("/:id", authMiddleware, studyGroupController.updateStudyGroup);
router.delete("/:id", authMiddleware, studyGroupController.deleteStudyGroup);

module.exports = router;
