const playerStatsSchema = new mongoose.Schema({
  puuid: { type: String, unique: true, required: true },

  totalGames: Number,

  avgPlacement: Number,
  top4Rate: Number,
  winRate: Number,

  avgLevel: Number,
  avgGoldLeft: Number,
  avgDamage: Number,

  traitStats: {
    type: Map,
    of: new mongoose.Schema({
      games: Number,
      avgPlacement: Number
    }, { _id: false })
  },

  lastComputed: Date
});