require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Connecting to mongo
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


// Routes
app.get("/", (req, res) => {
  res.send("TFT Analyzer Backend Running");
});

// Riot service route
// Instead of putting api code, riotService will handle api req
const riotService = require("./services/riotService");

// -- ENDPOINTS -- 
// Getting username. Need the username and tag
app.get("/account/:gameName/:tagLine", async (req, res) => {
  try {
    const data = await riotService.getAccountByRiotId(
      req.params.gameName,
      req.params.tagLine
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch account",
      details: err.response?.data || err.message
    });
  }
});

// Server is running
app.listen(3000, () => {
  console.log("Server running on port 3000");
});