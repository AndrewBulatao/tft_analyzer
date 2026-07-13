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
        unitsSum: 0
      };
    }
    // Count trait usage
    traitStats[traitName].games++;

    // Track placement
    traitStats[traitName].placementSum += placement;

    // Track trait tier
    traitStats[traitName].tierSum += trait.tier || 0;

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

      avgTier: trait.games
        ? trait.tierSum / trait.games : 0,

      avgUnits: trait.games
        ? trait.unitsSum / trait.games : 0,

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
        upsert: true
      }
    );
  }
}

module.exports = {
  processTraits,
  saveTraitStats
};