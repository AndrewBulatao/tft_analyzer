const mongoose = require("mongoose");

// The schema for the players match data
const trainingDataSchema = new mongoose.Schema({
  matchId: String,
  puuid: String,

  placement: Number,
  level: Number,
  goldLeft: Number,
  playersEliminated: Number,
  totalDamage: Number,

  traits: [String],
  units: [String]
});

module.exports = mongoose.model(
  "TrainingData",
  trainingDataSchema
);