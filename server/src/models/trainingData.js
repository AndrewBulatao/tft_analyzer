const mongoose = require("mongoose");

// The schema for the players match data
const trainingDataSchema = new mongoose.Schema({
  matchId: String,
  puuid: String,

  // Set the match was played in
  set: Number,

  // Which gamemode: ranked, normal, revival, event, or PVE
  gameMode: String,
  
  // Basic end of match stats
  placement: Number,
  level: Number,
  goldLeft: Number,
  playersEliminated: Number,
  totalDamage: Number,

  // Consider traits level and number of units played with traits
  traits: [{
    name: String,
    numUnits: Number,
    tier: Number
  }],

  // Consider unit level and items held
  units: [{
    name: String,
    tier: Number,
    items: [String]
  }],

  // Version of set played in game. Important if playing old set or revival games
  patch: String,

  // For storage purposes, add an expiration date
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export
module.exports = mongoose.model("TrainingData",trainingDataSchema);