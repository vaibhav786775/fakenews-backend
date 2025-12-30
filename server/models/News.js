const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  content: {
    type: String,
    required: true
  },

  prediction: {
    type: String,
    enum: ["FAKE", "REAL"],
    required: true
  },

  confidence: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("News", newsSchema);
