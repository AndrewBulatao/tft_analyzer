const mongoose = require("mongoose");

const unitStatsSchema = new mongoose.Schema({
  // Player this data belongs to
  puuid: {
    type: String,
    required: true,
    index: true
  },

  // Unit name (e.g. Teemo, Kobuko)
  unitName: {
    type: String,
    required: true
  },

  // Number of games this unit was played
  gamesPlayed: {
    type: Number,
    default: 0
  },

  // Number of first-place finishes
  wins: {
    type: Number,
    default: 0
  },

  // Number of Top 4 finishes
  top4: {
    type: Number,
    default: 0
  },

  // Average placement when this unit was played
  avgPlacement: {
    type: Number,
    default: 0
  },

  // Average star level 
  avgTier: {
    type: Number,
    default: 0
  },

  // Counts how often each item was equipped
  itemsUsed: {
    type: Map,
    of: Number,
    default: {}
  },

  // Average number of completed items on this unit
  avgItemsPerGame: {
    type: Number,
    default: 0
  },

  // Percentage of games where this unit was identified as the carry
  // (0 = never, 1 = always)
  carryRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 1
  },

  // Last time these statistics were updated
  lastUpdated: {
    type: Date,
    default: Date.now,
    required: true
  }
});

// One document per player + unit
unitStatsSchema.index(
  { puuid: 1, unitName: 1 },
  { unique: true }
);

module.exports =
  mongoose.models.UnitStats ||
  mongoose.model("UnitStats", unitStatsSchema);