const riotService = require("./riotService");
const matchService = require("./matchService");

// Optional: if you already have a PlayerStats model
const PlayerStats = require("../models/playerStats");

async function getStats(puuid) {
  try {
    // 1. Get recent match IDs
    const matchIds = await riotService.getMatchIds(puuid);

    if (!matchIds || matchIds.length === 0) {
      return {
        puuid,
        totalGames: 0
      };
    }

    // 2. Accumulators
    let totalGames = 0;
    let placementSum = 0;
    let top4 = 0;

    let levelSum = 0;
    let goldSum = 0;
    let damageSum = 0;

    // 3. Loop matches
    for (const matchId of matchIds) {
      const match = await matchService.getMatchWithCache(matchId);

      const player = match.info.participants.find(
        (p) => p.puuid === puuid
      );

      if (!player) continue;

      totalGames++;

      const placement = player.placement;
      placementSum += placement;

      if (placement <= 4) top4++;

      levelSum += player.level || 0;
      goldSum += player.gold_left || 0;
      damageSum += player.total_damage_to_players || 0;
    }

    // 4. Compute stats
    const stats = {
      puuid,
      totalGames,

      avgPlacement: totalGames ? placementSum / totalGames : 0,
      top4Rate: totalGames ? top4 / totalGames : 0,

      avgLevel: totalGames ? levelSum / totalGames : 0,
      avgGoldLeft: totalGames ? goldSum / totalGames : 0,
      avgDamage: totalGames ? damageSum / totalGames : 0,

      lastComputed: new Date()
    };

    PlayerStats.findOneAndUpdate(
        { puuid },
        stats,
        {
            psert: true,
            returnDocument: "after"
        }
    );

    return stats;
  } catch (err) {
    console.error("playerStatsService error:", err);
    throw err;
  }
}

module.exports = {
  getStats
};