const TraitStats = require("../models/traitStats");


// Process trait stats from a single match
function processTraits(traitStats, player, placement) {

  // Make sure player has traits
  if (!player.traits || !Array.isArray(player.traits)) {
    return;
  }

  // Traverse through player's traits
  for (const trait of player.traits) {

    const traitName = trait.name;

    // Ignore empty traits
    if (!traitName) continue;

    // Initialize trait stats if it does not exist
    if (!traitStats[traitName]) {
      traitStats[traitName] = {
        games: 0,
        wins: 0,
        top4s: 0,
        placementSum: 0,
        tierSum: 0,
        unitsSum: 0,
        activeGames: 0,
        deadGames: 0
      };
    }
    // Count trait usage: Doesnt mean its active, just present
    traitStats[traitName].games++;
    
    // Is active or not
    if ((trait.tier_current || 0) > 0) {
      traitStats[traitName].activeGames++;
    } else {
      traitStats[traitName].deadGames++;
    }

    // Track placement
    traitStats[traitName].placementSum += placement;

    // Track trait tier
    traitStats[traitName].tierSum += trait.tier_current || 0;

    // Track number of units in trait
    traitStats[traitName].unitsSum += trait.num_units || 0;

    // Track wins
    if (placement === 1) {
      traitStats[traitName].wins++;
    }

    // Track top 4 finishes
    if (placement <= 4) {
      traitStats[traitName].top4s++;
    }
  }
}

// Calculate and save trait stats
async function saveTraitStats(puuid, traitStats) {

  for (const name in traitStats) {

    const trait = traitStats[name];

    const stats = {
      puuid,
      traitName: name,

      gamesPlayed: trait.games,
      wins: trait.wins,
      top4: trait.top4s,

      avgPlacement: trait.games
        ? trait.placementSum / trait.games : 0,

      // Average tier: Truly shows how often they play a trait
      avgTier: trait.games
        ? trait.tierSum / trait.games : 0,

      avgUnits: trait.games
        ? trait.unitsSum / trait.games : 0,

      // Is trait active: Despite them activating it, could be filler
      activeGames: trait.activeGames,
      deadGames: trait.deadGames,

      lastComputed: new Date()
    };

    // Update stats
    await TraitStats.findOneAndUpdate(
      {
        puuid,
        traitName: name
      },
      {
        $set: stats
      },
      {
        upsert: true,
        returnDocument: "after"
      }
    );
  }
}

async function getStats(puuid){
  const traits = await TraitStats.find({puuid});
  return traits;
}

module.exports = {
  processTraits,
  saveTraitStats,
  getStats
};