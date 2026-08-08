const UnitStats = require("../models/unitStats");


// Process unit stats from a single match
function processUnits(unitStats, player, placement) {

  // Make sure player has units
  if (!player.units || !Array.isArray(player.units)) {
    return;
  }

  // Traverse through player's units in this match
  for (const unit of player.units) {

    const unitName = unit.character_id;

    // Initialize unit stats object if it does not exist
    if (!unitStats[unitName]) {
      unitStats[unitName] = {
        games: 0,
        wins: 0,
        top4s: 0,
        placementSum: 0,
        tierSum: 0,
        itemsUsed: {}
      };
    }

    //console.log(unit);

    // Check to see if the unit has items and how often its used
    if (Array.isArray(unit.itemNames)) {
      console.log("I RUN");
      for (const item of unit.itemNames) {

        if (!unitStats[unitName].itemsUsed[item]) {
          unitStats[unitName].itemsUsed[item] = 0;
        }

        unitStats[unitName].itemsUsed[item]++;
      }
    }

    // Count unit usage
    unitStats[unitName].games++;

    // Track star level
    unitStats[unitName].tierSum += unit.tier || 0;

    // Track placement
    unitStats[unitName].placementSum += placement;

    if (placement === 1) {
      unitStats[unitName].wins++;
    }

    if (placement <= 4) {
      unitStats[unitName].top4s++;
    }
  }
}


// Finalize calculations and save to database
async function saveUnitStats(puuid, unitStats) {

  for (const name in unitStats) {

    const unit = unitStats[name];

    const stats = {
      puuid,
      unitName: name,

      games: unit.games,
      wins: unit.wins,
      top4s: unit.top4s,

      itemsUsed: unit.itemsUsed,
      
      // Check if the unit has appeared in any games. If it has, calculate stats;
      // otherwise, set the values to 0 to prevent division by zero.
      avgTier: unit.games ? unit.tierSum / unit.games : 0,
      avgPlacement: unit.games ? unit.placementSum / unit.games: 0,
      winRate: unit.games ? unit.wins / unit.games: 0,
      top4Rate: unit.games ? unit.top4s / unit.games: 0
    };

    // Find the unit stats document 
    // where the player's PUUID matches and the unit name matches
    await UnitStats.findOneAndUpdate(
      {
        puuid,
        unitName: name
      },
      { // Update stats
        $set: stats
      },
      { // If document doesnt exist, create new one and return new stats
        upsert: true,
        returnDocument: "after"
      }
    );
  }
}

async function getStats(puuid){
  const units = await UnitStats.find({puuid});
  return units;
}

async function getMostPlayed(puuid){
  // Traverse through all units
  const units = await unitStats.find({puuid})
    .sort({gamesPlayed: -1})

    // get the top 3 most played units
    .limit(3);
  return units;
}

module.exports = {
  processUnits,
  saveUnitStats,
  getStats
};