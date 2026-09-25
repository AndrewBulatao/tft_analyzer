// Handles TFT static data and image assets from Riot Data Dragon
// TODO: Find the datadragon version for set 15
const DATA_DRAGON_VERSION = "xxxx";
const DATA_DRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}`;
const DATA_DRAGON_IMAGE_BASE = `${DATA_DRAGON_BASE}/img`;
const dataCache = {};

// Get static TFT data
async function getTftData(type) {
  if (dataCache[type]) {
    return dataCache[type];
  }
  const response = await fetch(`${DATA_DRAGON_BASE}/data/en_US/${type}.json`);
  if (!response.ok) {
    throw new Error(`Failed to fetch TFT data: ${type}`);
  }
  const data = await response.json();
  dataCache[type] = data.data;
  return data.data;
}

// Get champion information
async function getChampion(id) {
  const champions = await getTftData("tft-champion");
  return champions[id] || null;
}

// Get item information
async function getItem(id) {
  const items = await getTftData("tft-item");
  return items[id] || null;
}

// Get trait information
async function getTrait(id) {
  const traits = await getTftData("tft-trait");
  return traits[id] || null;
}

// Build an image URL
function getImageUrl(type, filename) {
  return `${DATA_DRAGON_IMAGE_BASE}/${type}/${filename}`;
}

// Export
module.exports = {
  getChampion,
  getItem,
  getTrait,
  getImageUrl
};