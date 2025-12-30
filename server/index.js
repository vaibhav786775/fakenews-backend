const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require("dotenv").config({ debug: true, path: path.resolve(__dirname, '.env') });
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
  res.send("backend boom ");
});

const PORT = 3000;
const mongoUri = process.env.MONGO_URI;
//  all consts
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const newsRoutes = require("./routes/newsRoutes");


//  uses 



app.use("/api/admin", adminRoutes);


// routes

app.use("/api/auth", authRoutes)
app.use("/api/news", newsRoutes);


// ....................................
mongoose.connect(mongoUri)
  .then(() => {
    console.log("mongo db connected");
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("server is crashed ", error);
  });