const mongoose = require("mongoose");

// Schema for getting general match information
const matchSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true,
    unique: true
  },

  matchData: {
    type: Object,
    required: true
  },

  // Important for getting rid of old matches
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Match", matchSchema);