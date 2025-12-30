const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const generateOtp = require("../utils/generateOtp");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    // 🔥 If user exists but not verified → resend OTP
    if (user && !user.isVerified) {
      const otp = generateOtp();
      user.otp = otp;
      user.otpExpiry = Date.now() + 10 * 60 * 1000;

      await user.save();

      try {
        await sendEmail(
          email,
          "Verify your email - Fake News Detector",
          `Your OTP is ${otp}. It is valid for 10 minutes.`
        );
      } catch (err) {
        console.error("OTP resend failed:", err.message);
      }

      return res.status(200).json({
        message: "OTP resent. Please verify your email."
      });
    }

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false
    });

    await user.save();

    try {
      await sendEmail(
        email,
        "Verify your email - Fake News Detector",
        `Your OTP is ${otp}. It is valid for 10 minutes.`
      );
    } catch (err) {
      console.error("OTP email failed:", err.message);
    }

    res.status(201).json({
      message: "Account created. Please verify OTP sent to email."
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY OTP ================= */

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (
      String(user.otp) !== String(otp) ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({ message: "Email verified successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= FORGOT PASSWORD ================= */

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    try {
      await sendEmail(
        email,
        "Password Reset OTP",
        `Your OTP for password reset is ${otp}`
      );
    } catch (err) {
      console.error("Reset OTP email failed:", err.message);
    }

    res.json({ message: "OTP sent to email" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.resetOtp) {
      return res.status(400).json({ message: "Unauthorized request" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
