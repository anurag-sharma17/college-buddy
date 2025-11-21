const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    console.log("Verifying token...");
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", decoded);

    const User = mongoose.model("User");
    const user = await User.findById(decoded.userId).select("-password");
    console.log("User found:", !!user);

    if (!user) {
      console.log("User not found for userId:", decoded.userId);
      return res.status(401).json({ error: "Invalid token - user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    console.error("Error type:", err.name);
    res.status(401).json({ error: "Invalid token", details: err.message });
  }
};

module.exports = authMiddleware;
