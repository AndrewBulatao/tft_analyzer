const axios = require("axios");

const RIOT_API_KEY = process.env.RIOT_API_KEY;

// Users ID
async function getAccountByRiotId(gameName, tagLine) {
  const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

  const response = await axios.get(url, {
    headers: {
      "X-Riot-Token": RIOT_API_KEY
    }
  });

  return response.data;
}

// Users Match Ids (By PUUID)
async function getMatchIds(puuid) {
  const url = `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?count=5`;

  const response = await axios.get(url, {
    headers: {
      "X-Riot-Token": RIOT_API_KEY
    }
  });

  return response.data;
}

// Getting user's match details
async function getMatch(matchId) {
  const url = `https://americas.api.riotgames.com/tft/match/v1/matches/${matchId}`;

  const response = await axios.get(url, {
    headers: {
      "X-Riot-Token": RIOT_API_KEY
    }
  });

  return response.data;
}

// Export what was gathered
module.exports = {
  getAccountByRiotId,
  getMatchIds,
  getMatch
};