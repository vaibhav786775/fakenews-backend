const express = require("express");
const { registerUser , verifyOtp, loginUser, forgotPassword, verifyResetOtp, resetPassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware")
const authRouter = express.Router();

const User = require("../models/user");

authRouter.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Protected route accessed",
      user: user
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
authRouter.post("/register", registerUser);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/login", loginUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-reset-otp", verifyResetOtp);
authRouter.post("/reset-password", resetPassword);

module.exports = authRouter;