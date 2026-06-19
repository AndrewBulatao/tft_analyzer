const mongoose = require("mongoose");

// Schema for the summoner searched
const playerSchema = new mongoose.Schema({
  puuid: {
    type: String,
    required: true,
    unique: true
  },

  gameName: String,
  tagLine: String,

  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Player", playerSchema);