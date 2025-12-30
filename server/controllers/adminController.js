const News = require("../models/News");

exports.getStats = async (req, res) => {
  try {
    const total = await News.countDocuments();
    const fakeCount = await News.countDocuments({ prediction: "FAKE" });
    const realCount = await News.countDocuments({ prediction: "REAL" });

    res.json({
      totalPredictions: total,
      fake: fakeCount,
      real: realCount
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
