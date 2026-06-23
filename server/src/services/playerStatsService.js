const riotService = require("./riotService");
const matchService = require("./matchService");

// Get stats schema
const PlayerStats = require("../models/playerStats");

async function getStats(puuid) {
  try {
    // Get recent matches using puuid
    const matchIds = await riotService.getMatchIds(puuid);

    if (!matchIds || matchIds.length === 0) {
      return {
        puuid,
        totalGames: 0
      };
    }

    // Init vars 
    let totalGames = 0;
    let placementSum = 0;
    let top4 = 0;

    let levelSum = 0;
    let goldSum = 0;
    let damageSum = 0;

    let traitStats = {};

    // Go through recent matches
    for (const matchId of matchIds) {
      const match = await matchService.getMatchWithCache(matchId);

      const player = match.info.participants.find(
        (p) => p.puuid === puuid
      );

      if (!player) continue;

      totalGames++;

      // Get stats already given to us
      const placement = player.placement;
      placementSum += placement;

      if (placement <= 4) top4++;

      levelSum += player.level || 0;
      goldSum += player.gold_left || 0;
      damageSum += player.total_damage_to_players || 0;

      // Get traits
      if (player.traits && Array.isArray(player.traits)) {
        // Find the traits used
        for (const trait of player.traits) {
          const name = trait.name;
          // If trait exists create a record for it
          if (!traitStats[name]) {
            traitStats[name] = {
              games: 0,
              activeGames: 0,
              deadGames: 0,
              tierSum: 0,
              unitSum: 0
            };
          }

          traitStats[name].games++;
          traitStats[name].tierSum += trait.tier_current || 0;
          traitStats[name].unitSum += trait.num_units || 0;

          if ((trait.tier_current || 0) > 0) {
            traitStats[name].activeGames++;
          } else {
            traitStats[name].deadGames++;
          }
        }
      }
    }

    // ---- finalize trait stats ----
    for (const name in traitStats) {
      const t = traitStats[name];

      t.avgTier = t.games ? t.tierSum / t.games : 0;
      t.avgUnits = t.games ? t.unitSum / t.games : 0;
      t.activationRate = t.games ? t.activeGames / t.games : 0;
      t.deadRate = t.games ? t.deadGames / t.games : 0;
    }

    // Final response object
    const stats = {
      puuid,
      totalGames,

      avgPlacement: totalGames ? placementSum / totalGames : 0,
      top4Rate: totalGames ? top4 / totalGames : 0,

      avgLevel: totalGames ? levelSum / totalGames : 0,
      avgGoldLeft: totalGames ? goldSum / totalGames : 0,
      avgDamage: totalGames ? damageSum / totalGames : 0,

      traitStats,

      lastComputed: new Date()
    };

    // Save to DB (fixed: missing await)
    await PlayerStats.findOneAndUpdate(
      { puuid },
      stats,
      {
        upsert: true,
        returnDocument: "after"
      }
    );

    return stats;

  } catch (err) {
    console.error("playerStatsService error:", err);
    throw err;
  }
}

// Export
module.exports = {
  getStats
};