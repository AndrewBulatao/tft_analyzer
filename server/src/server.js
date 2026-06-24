require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const exportRoutes = require("./routes/export.routes");

const testRoutes = require("./routes/test");

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

app.use("/export", exportRoutes);

// Testing
//app.use("/", testRoutes);

// Riot service route
// Instead of putting api code, riotService will handle api req
const riotService = require("./services/riotService");
const matchService = require("./services/matchService");
const playerStatsService = require("./services/playerStatsService");


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

// Getting match IDs by PUUID
app.get("/matches/:gameName/:tagLine", async (req, res) => {
  try {
    const account = await riotService.getAccountByRiotId(
      req.params.gameName,
      req.params.tagLine
    );

    const matchIds = await riotService.getMatchIds(account.puuid);

    res.json({
      puuid: account.puuid,
      matchIds
    });

  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch matches",
      details: err.response?.data || err.message
    });
  }
});

// Printing out player stats
app.get("/player-stats/:gameName/:tagLine", async (req, res) => {
  try {
    const { gameName, tagLine } = req.params;

    const account = await riotService.getAccountByRiotId(
      gameName,
      tagLine
    );

    const stats = await playerStatsService.getStats(account.puuid);

    res.json(stats);

  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch player stats",
      details: err.message
    });
  }
});

// Getting match details from tags
app.get("/match/:matchId", async (req, res) => {
  try {
    const match = await matchService.getMatchWithCache(
      req.params.matchId
    );

    res.json(match);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch match details",
      details: err.response?.data || err.message
    });
  }
});

// Get top 10 placements
app.get("/placements/:gameName/:tagLine", async (req, res) => {
  try {
    // Get account
    const account = await riotService.getAccountByRiotId(
      req.params.gameName,
      req.params.tagLine
    );

    // Get recent match ids
    const matchIds = await riotService.getMatchIds(account.puuid);

    const placements = [];

    // Loop through each match
    for (const matchId of matchIds) {
      const match = await matchService.getMatchWithCache(matchId);

      // Find the player in the match
      const player = match.info.participants.find(
        p => p.puuid === account.puuid
      );

      placements.push({
        matchId,
        placement: player.placement
      });
    }

    res.json(placements);

  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch placements",
      details: err.response?.data || err.message
    });
  }
});

// Server is running
app.listen(3000, () => {
  console.log("Server running on port 3000");
});