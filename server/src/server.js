require("dotenv").config();

// Connecting to default servers
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Routes
const exportRoutes = require("./routes/export.routes");
const testRoutes = require("./routes/test");

// Services
const riotService = require("./services/riotService");
const matchService = require("./services/matchService");
const playerStatsService = require("./services/playerStatsService");
const traitStatsService = require("./services/traitService");
const unitStatsService = require("./services/unitStatsService");

// Models
const Player = require("./models/player");
const PlayerMatch = require("./models/playerMatch");
const PlayerStats = require("./models/playerStats");
const TraitStats = require("./models/traitStats");
const UnitStats = require("./models/unitStats");
const Match = require("./models/match");


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


// Testing
//app.use("/", testRoutes);
//app.use("/export", exportRoutes);


// Export service route
const exportService = require("./services/exportService");
const unitStats = require("./models/unitStats");

// FOR ERASING DB
app.delete("/reset-db", async (req, res) => {
  try {
    await Player.deleteMany({});
    await Match.deleteMany({});
    await PlayerMatch.deleteMany({});
    await PlayerStats.deleteMany({});
    await TraitStats.deleteMany({});
    await UnitStats.deleteMany({});

    res.json({ message: "Database cleared." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// -- ENDPOINTS --

// Getting username. Need the username and tag
app.get("/account/:gameName/:tagLine", async (req, res) => {
  try {
    const data = await riotService.getAccountByRiotId(
      req.params.gameName,
      req.params.tagLine
    );

    // Output data in json
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

    // Counters for cache statistics
    let cached = 0;
    let downloaded = 0;


    for (const matchId of matchIds) {

      const existing = await Match.findOne({ matchId });

      // For testing purposes. set log to true to printout
      const match = await matchService.getMatchWithCache(
        matchId, 
        {log: true }
      );

      if (existing) {
        cached++;
      } else {
        downloaded++;
      }
    }

    // Return a summary of the sync operation
    res.json({
      puuid: account.puuid,
      totalMatches: matchIds.length,
      cached,
      downloaded,
      matchIds
    });

    // Catcher
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

    const playerStats = await playerStatsService.getStats(account.puuid);
    const traitStats = await traitStatsService.getStats(account.puuid);
    const unitStats = await unitStatsService.getStats(account.puuid);
    // Output stats
    res.json({
      playerStats,
      traitStats,
      unitStats
    });

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

    // Output the match
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

      // Add placement to array
      placements.push({
        matchId,
        placement: player.placement
      });
    }

    // Output in json
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

// -- EXPORTING TO EXCEL --
app.get("/exportTraits/:gameName/:tagLine", async (req, res) => {
  try {
    const { gameName, tagLine } = req.params;

    // Get player's PUUID
    const account = await riotService.getAccountByRiotId(
      gameName,
      tagLine
    );

    // Generate the CSV
    const filePath = await exportService.exportTraits(
        account.puuid,
        gameName
    );
    // Send the file to the client
    res.download(filePath);

  } catch (err) {
    res.status(500).json({
      error: "Failed to export traits",
      details: err.message
    });
  }
});