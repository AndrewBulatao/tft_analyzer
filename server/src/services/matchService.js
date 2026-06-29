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


async function getFilteredMatches(
    puuid,
    {
        set,
        gameMode,
        count = 10
    }
) {

    const matchIds = await riotService.getMatchIds(puuid);

    const matches = [];

    for (const matchId of matchIds) {

        const match = await getMatchWithCache(matchId);

        const player = match.info.participants.find(
            p => p.puuid === puuid
        );

        if (!player) continue;

        // Check set
        if (set) {

            const firstTrait = player.traits.find(t => t.name);

            const matchSet =
                firstTrait?.name.match(/^TFT(\d+)_/)?.[1];

            if (`${matchSet}` !== `${set}`) {
                continue;
            }
        }

        // Check gamemode
        if (gameMode) {

            // Check to see which gameMode it is
            if (match.info.queue_id !== gameMode) {
                continue;
            }
        }

        matches.push(match);

        if (matches.length >= count) {
            break;
        }
    }

    return matches;
}

module.exports = {
  getMatchWithCache,
  getFilteredMatches
};