const mongoose = require("mongoose");

const playerStatsSchema = new mongoose.Schema({
  puuid: { type: String, unique: true, required: true },

  totalGames: Number,
  avgPlacement: Number,
  top4Rate: Number,

  avgLevel: Number,
  avgGoldLeft: Number,
  avgDamage: Number,

  traitStats: {
    type: Map,
    of: new mongoose.Schema(
      {
        games: Number,
        activeGames: Number,
        deadGames: Number,
        
        tierSum: Number,
        unitSum: Number,
        
        avgTier: Number,
        avgUnits: Number,
        activationRate: Number,
        deadRate: Number,

        winRate: Number,
        top4Rate: Number,
        avgPlacement: Number
      },
      { _id: false }
    )
  },

  lastComputed: Date
});

module.exports = mongoose.model("PlayerStats", playerStatsSchema);