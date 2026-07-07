const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true,
    unique: true
  },

  // Complete Riot API response
  matchData: {
    type: Object,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports =
  mongoose.models.Match || mongoose.model("Match", matchSchema);