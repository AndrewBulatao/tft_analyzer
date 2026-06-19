const mongoose = require("mongoose");

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