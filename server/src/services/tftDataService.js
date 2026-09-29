// Handles TFT static data and image assets from Riot Data Dragon

const DATA_DRAGON_VERSIONS_URL = "https://ddragon.leagueoflegends.com/api/versions.json";
const COMMUNITY_DRAGON_BASE = "https://raw.communitydragon.org/latest/game/assets/characters";

let dataDragonVersions = null;
const dataCache = {};

// Get all Data Dragon versions
async function getDataDragonVersions() {
  if (dataDragonVersions) {
    return dataDragonVersions;
  }

  const response = await fetch(DATA_DRAGON_VERSIONS_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch Data Dragon versions");
  }

  dataDragonVersions = await response.json();

  return dataDragonVersions;
}

// Get Data Dragon version for a specific game version
async function getDataDragonVersion(gameVersion) {
  const versions = await getDataDragonVersions();

  if (gameVersion) {
    const exactVersion = versions.find(
      version => version === gameVersion
    );

    if (exactVersion) {
      return exactVersion;
    }

    const patchVersion = gameVersion
      .split(".")
      .slice(0, 2)
      .join(".");

    const matchingVersion = versions.find(
      version => version.startsWith(`${patchVersion}.`)
    );

    if (matchingVersion) {
      return matchingVersion;
    }
  }

  return versions[0];
}

// Get static TFT data
async function getTftData(type, gameVersion) {
  const version = await getDataDragonVersion(gameVersion);
  const cacheKey = `${version}:${type}`;

  if (dataCache[cacheKey]) {
    return dataCache[cacheKey];
  }

  const dataDragonBase =
    `https://ddragon.leagueoflegends.com/cdn/${version}`;

  const response = await fetch(
    `${dataDragonBase}/data/en_US/${type}.json`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch TFT data: ${type}`);
  }

  const data = await response.json();

  console.log("DATA DRAGON VERSION:", version);
  console.log("DATA TYPE:", type);
  console.log("DATA COUNT:", Object.keys(data.data || {}).length);

  dataCache[cacheKey] = data.data;

  return data.data;
}

// Get champion information
async function getChampion(id, gameVersion) {
  const champions = await getTftData(
    "tft-champion",
    gameVersion
  );

  return champions[id] || null;
}

// Get item information
async function getItem(id, gameVersion) {
  const items = await getTftData(
    "tft-item",
    gameVersion
  );

  return items[id] || null;
}

// Get trait information
async function getTrait(id, gameVersion) {
  const traits = await getTftData(
    "tft-trait",
    gameVersion
  );

  return traits[id] || null;
}

// Build an image URL
async function getImageUrl(type, filename, gameVersion) {
  const version = await getDataDragonVersion(gameVersion);
  const dataDragonImageBase =
    `https://ddragon.leagueoflegends.com/cdn/${version}/img`;

  return `${dataDragonImageBase}/${type}/${filename}`;
}

// Get current TFT champion image URL
function getChampionImageUrl(characterId) {
  let assetName = characterId
    .replace(/^DA_18_/, "")
    .replace(/^DA_/, "")
    .replace(/18$/, "")
    .replace(/_AP$/, "")
    .replace(/_AD$/, "")
    .toLowerCase();

  if (assetName === "gnarsmall") {
    assetName = "gnar";
  }

  return `${COMMUNITY_DRAGON_BASE}/tft18_${assetName}/tft18_${assetName}_square.png`;
}

// Export
module.exports = {
  getDataDragonVersions,
  getDataDragonVersion,
  getTftData,
  getChampion,
  getItem,
  getTrait,
  getImageUrl,
  getChampionImageUrl
};