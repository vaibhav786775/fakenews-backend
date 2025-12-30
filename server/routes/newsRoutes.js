const express = require("express");
const { detectNews , getHistory } = require("../controllers/newsController");
const authMiddleware = require("../middleware/authMiddleware");

const newsrouter = express.Router();

newsrouter.post("/detect", authMiddleware, detectNews);
newsrouter.get("/history", authMiddleware, getHistory);

module.exports = newsrouter;
