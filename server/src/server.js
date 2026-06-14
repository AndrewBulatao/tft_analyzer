require("dotenv").config();

const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("TFT Analyzer Backend Running");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

// Getting searched user's name
const riotService = require("./services/riotService");

app.get("/summoner/:name", async (req, res) => {
  try {
    const data = await riotService.getSummonerByName(req.params.name);
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch summoner",
      details: err.response?.data || err.message
    });
  }
});