const axios = require("axios");

const RIOT_API_KEY = process.env.RIOT_API_KEY;

async function getSummonerByName(name) {
  const url = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`;

  const response = await axios.get(url, {
    headers: {
      "X-Riot-Token": RIOT_API_KEY
    }
  });

  return response.data;
}

module.exports = {
  getSummonerByName
};