const Match = require("../models/Match");
const riotService = require("./riotService");

// Checker to find the match if already in the db
async function getMatchWithCache(matchId) {
  const existingMatch = await Match.findOne({ matchId });

  if (existingMatch) {
    console.log(`Cache hit: ${matchId}`);
    return existingMatch.matchData;
  }

  console.log(`Cache miss: ${matchId}`);

  const match = await riotService.getMatch(matchId);

  await Match.create({
    matchId,
    matchData: match
  });

  return match;
}

module.exports = {
  getMatchWithCache
};