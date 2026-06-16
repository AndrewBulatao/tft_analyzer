const axios = require("axios");

const RIOT_API_KEY = process.env.RIOT_API_KEY;

// STEP 1: Riot ID → PUUID
async function getAccountByRiotId(gameName, tagLine) {
  const url = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

  const response = await axios.get(url, {
    headers: {
      "X-Riot-Token": RIOT_API_KEY
    }
  });

  return response.data;
}

module.exports = {
  getAccountByRiotId
};