const params = new URLSearchParams(window.location.search);
const gameName = params.get("gameName");
const tagLine = params.get("tagLine");
async function loadStats() {
  try {
    const response = await fetch(`http://localhost:3000/player-stats/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
    if (!response.ok) {
      throw new Error("Failed to fetch player stats");
    }
    
    const data = await response.json();
    const stats = data.playerStats;

    console.log(data);
    console.log(data.playerStats);
    console.log(stats.avgLevel);

    document.querySelector("#header_summoner").textContent = `${gameName} #${tagLine}`;
    document.querySelector("#total-games").textContent = stats.totalGames;
    document.querySelector("#average-placement").textContent = stats.avgPlacement;
    document.querySelector("#top-four-rate").textContent = `${(stats.top4Rate * 100).toFixed(1)}%`;
    document.querySelector("#average-level").textContent = stats.avgLevel.toFixed(1);
    document.querySelector("#average-gold").textContent = stats.avgGoldLeft.toFixed(1);
    document.querySelector("#average-damage").textContent = stats.avgDamage.toFixed(1);
  } catch (err) {
    console.error(err);
    document.querySelector("#header_summoner").textContent = "Failed to load player stats";
  }
}
loadStats();