const mongoose = require("mongoose");

const playerMatchSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true,
    index: true
  },

  puuid: {
    type: String,
    required: true,
    index: true
  },

  placement: Number,

  level: Number,

  goldLeft: Number,

  damage: Number,

  traits: [
    {
      name: String,
      numUnits: Number,
      tier: Number
    }
  ],

  units: [
    {
      name: String,
      tier: Number,
      items: [String]
    }
  ],

  patch: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate PlayerMatch documents
playerMatchSchema.index(
  { puuid: 1, matchId: 1 },
  { unique: true }
);

module.exports =
  mongoose.models.PlayerMatch ||
  mongoose.model("PlayerMatch", playerMatchSchema);