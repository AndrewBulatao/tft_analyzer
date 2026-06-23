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

    // Go through 10 recent matches
    for (const matchId of matchIds) {
      const match = await matchService.getMatchWithCache(matchId);

      const player = match.info.participants.find(
        (p) => p.puuid === puuid
      );

      // We find the player
      if (!player) continue;

      totalGames++;
      
      // Get player's placement matches 
      const placement = player.placement;
      placementSum += placement;

      if (placement <= 4) top4++;

      // End game stats
      levelSum += player.level || 0;
      goldSum += player.gold_left || 0;
      damageSum += player.total_damage_to_players || 0;

      // Getting traits usage
      if (player.traits && Array.isArray(player.traits)) {
        for (const trait of player.traits) {
          const name = trait.name;
          
          // Init trait stats object if it doesnt exist
          if (!traitStats[name]) {
            traitStats[name] = {
              games: 0,
              activeGames: 0,
              deadGames: 0,
              tierSum: 0,
              unitSum: 0
            };
          }

          // Update traits statistic for current match
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

    // Finalize trait stats
    for (const name in traitStats) {
      const t = traitStats[name];

      t.avgTier = t.games ? t.tierSum / t.games : 0;
      t.avgUnits = t.games ? t.unitSum / t.games : 0;
      t.activationRate = t.games ? t.activeGames / t.games : 0;
      t.deadRate = t.games ? t.deadGames / t.games : 0;
    }

    // Get player stats
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

    // update stats
    await PlayerStats.findOneAndUpdate(
      { puuid },
      {
        $set: {
          totalGames,
          avgPlacement: stats.avgPlacement,
          top4Rate: stats.top4Rate,

          avgLevel: stats.avgLevel,
          avgGoldLeft: stats.avgGoldLeft,
          avgDamage: stats.avgDamage,

          traitStats,

          lastComputed: stats.lastComputed
        }
      },
      {
        upsert: true,
        new: true
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