const mongoose = require("mongoose");

const playerStatsSchema = new mongoose.Schema({
  puuid: {
    type: String,
    required: true,
    unique: true
  },

  totalGames: {
    type: Number,
    default: 0
  },

  avgPlacement: {
    type: Number,
    default: 0
  },

  avgLevel: {
    type: Number,
    default: 0
  },

  avgDamage: {
    type: Number,
    default: 0
  },

  avgGoldLeft: {
  type: Number,
  default: 0
  },

  top4Rate: {
  type: Number,
  default: 0
  },
  
  lastComputed: {
    type: Date,
    default: Date.now
  }
});

module.exports =
  mongoose.models.PlayerStats ||
  mongoose.model("PlayerStats", playerStatsSchema);