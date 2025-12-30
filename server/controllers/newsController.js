const News = require("../models/News");
const callAI = require("../utils/callAi");

exports.detectNews = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "News text is required" });
    }

    // call AI service
    const aiResult = await callAI(content);

    // save result in database
    const news = await News.create({
      userId: req.user.id,
      content,
      prediction: aiResult.label,
      confidence: aiResult.confidence
    });

    res.json({
      message: "Prediction successful",
      result: news
    });

  } catch (error) {
    res.status(500).json({ message: "AI detection failed" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    // req.user.id comes from JWT middleware
    const userId = req.user.id;

    const history = await News.find({ userId })
      .sort({ createdAt: -1 }); // latest first

    res.json({
      count: history.length,
      history
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};
