const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  puuid: {
    type: String,
    required: true,
    unique: true
  },

  gameName: {
    type: String,
    required: true
  },

  tagLine: {
    type: String,
    required: true
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports =
  mongoose.models.Player || mongoose.model("Player", playerSchema);