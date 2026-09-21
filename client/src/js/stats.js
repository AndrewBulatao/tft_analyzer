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

async function loadMatches() {
  try {
    const response = await fetch(`http://localhost:3000/match-stats/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
    if (!response.ok) {
      throw new Error("Failed to fetch match stats");
    }
    const matches = await response.json();
    const matchesList = document.querySelector("#matches-list");
    matchesList.innerHTML = "";
    matches.forEach((match) => {
      const matchCard = document.createElement("div");
      matchCard.classList.add("match-card");
      const placementSuffix = match.placement === 1 ? "st" : match.placement === 2 ? "nd" : match.placement === 3 ? "rd" : "th";
      const timeAlive = Math.floor(match.gameLength / 60);
      matchCard.innerHTML = `
        <div class="match-header">
          <span class="match-placement">${match.placement}<sup>${placementSuffix}</sup></span>
          <span class="match-queue">${match.queueId === 1100 ? "Ranked" : "Normal"}</span>
        </div>
        <div class="match-summary">
          <div>
            <span>Level</span>
            <strong>${match.level}</strong>
          </div>
          <div>
            <span>Time Alive</span>
            <strong>${timeAlive}m</strong>
          </div>
          <div>
            <span>Damage</span>
            <strong>${match.damage}</strong>
          </div>
        </div>
        <div class="match-little-legend">
          ${match.companion?.content_ID || "Little Legend"}
        </div>
        <div class="match-traits">
          <h3>Traits</h3>
          <div class="trait-list">
            ${match.traits.map(trait => `
              <div class="trait">
                <span>${trait.name}</span>
                <span>${trait.tier_current}</span>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="match-units">
          <h3>Units</h3>
          <div class="unit-list">
            ${match.units.map(unit => `
              <div class="unit">
                <span class="unit-name">${unit.character_id}</span>
                <span class="unit-tier">${"★".repeat(unit.tier || 0)}</span>
                <span class="unit-items">${(unit.itemNames || []).join(" ")}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `;
      matchesList.appendChild(matchCard);
    });
  } catch (err) {
    console.error(err);
  }
}

loadStats()
loadMatches();