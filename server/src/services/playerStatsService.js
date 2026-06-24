const riotService = require("../services/riotService");
const matchService = require("../services/matchService");

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

        // IMPORTANT: prevents duplicate counting per match
        const seenInMatch = new Set();

        for (const trait of player.traits) {
          const name = trait.name;

          // Init trait stats object if it doesnt exist
          if (!traitStats[name]) {
            traitStats[name] = {
              games: 0,
              activeGames: 0,
              deadGames: 0,

              wins: 0,
              top4s: 0,
              placementSum: 0,

              tierSum: 0,
              unitSum: 0
            };
          }

          const isActive = (trait.tier_current || 0) > 0;

          // Count trait only once per match
          if (!seenInMatch.has(name)) {
            traitStats[name].games++;
            seenInMatch.add(name);
          }

          // Active vs inactive logic
          if (isActive) {

            traitStats[name].activeGames++;

            traitStats[name].tierSum += trait.tier_current || 0;
            traitStats[name].unitSum += trait.num_units || 0;

            traitStats[name].placementSum += placement;

            if (placement === 1) {
              traitStats[name].wins++;
            }

            if (placement <= 4) {
              traitStats[name].top4s++;
            }

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

      t.winRate = t.games ? t.wins / t.games : 0;
      t.top4Rate = t.games ? t.top4s / t.games : 0;
      t.avgPlacement = t.games ? t.placementSum / t.games : 0;
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
        $set: stats
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