// Analyzes ALL given match data of player of interest
// Uploads to database
const riotService = require("../services/riotService");
const matchService = require("../services/matchService");
const unitStatsService = require("../services/unitStatsService");
const traitStatsService = require("../services/traitService");

// Get stats schema
const PlayerStats = require("../models/playerStats");

// To run just need puuid
async function getStats(puuid) {
  try {
    // Try getting match IDs
    const matchIds = await riotService.getMatchIds(puuid);

    // If player has 0 matches or no matchIDs, return puuid and total games = 0
    if (!matchIds || matchIds.length === 0) {
      return {
        puuid,
        totalGames: 0
      };
    }

    // Otherwise, init vars
    let totalGames = 0;
    let placementSum = 0;
    let top4 = 0;

    let levelSum = 0;
    let goldSum = 0; 
    let damageSum = 0;

    // Trait and unit stats accumulator
    let unitStats = {};
    let traitStats = {};

    // Traverse through the entire matchID array, retrieve each match,
    // and extract this player's stats from that specific match
    for (const matchId of matchIds) {
      const match = await matchService.getMatchWithCache(matchId);

      const player = match.info.participants.find(
        (p) => p.puuid === puuid
      );

      // We find the player
      if (!player) continue;
      totalGames++;

      // Placement matches and sum
      const placement = player.placement;
      placementSum += placement;

      if (placement <= 4) top4++;

      // End game stats
      levelSum += player.level || 0;
      goldSum += player.gold_left || 0;
      damageSum += player.total_damage_to_players || 0;

      // Getting trait stats
      traitStatsService.processTraits(
        traitStats,
        player,
        placement
      );
      // Getting unit stats
      unitStatsService.processUnits(
        unitStats,
        player,
        placement
      );
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

      lastComputed: new Date()
    };

    // Update trait stats
    await traitStatsService.saveTraitStats(
      puuid,
      traitStats
    );
     
    // Update unit stats
    await unitStatsService.saveUnitStats(
      puuid,
      unitStats
    );

    // update stats
    await PlayerStats.findOneAndUpdate(
      { puuid },
      {
        $set: stats
      },
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