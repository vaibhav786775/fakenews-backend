const User = require("../models/user");

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access denied" });
    }

    next();

  } catch (error) {
    res.status(500).json({ message: "Admin verification failed" });
  }
};

module.exports = adminMiddleware;
