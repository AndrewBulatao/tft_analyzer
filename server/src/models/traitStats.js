const mongoose = require("mongoose");

const traitStatsSchema = new mongoose.Schema({
  puuid: {
    type: String,
    required: true,
    index: true
  },

  traitName: {
    type: String,
    required: true
  },

  gamesPlayed: {
    type: Number,
    default: 0
  },

  wins: {
    type: Number,
    default: 0
  },

  top4: {
    type: Number,
    default: 0
  },

  avgPlacement: {
    type: Number,
    default: 0
  },

  avgTier: {
    type: Number,
    default: 0
  },

  avgUnits: {
    type: Number,
    default: 0
  },

  activeGames: {
    type: Number,
    default: 0
  },

  deadGames: {
    type: Number,
    default: 0
  },

  lastComputed: {
    type: Date,
    default: Date.now
  }
});

// One document per player + trait
traitStatsSchema.index(
  { puuid: 1, traitName: 1 },
  { unique: true }
);

module.exports =
  mongoose.models.TraitStats ||
  mongoose.model("TraitStats", traitStatsSchema);