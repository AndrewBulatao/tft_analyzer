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
        console.log("MATCH DATA:", matches);
        const matchesList = document.querySelector("#matches-list");
        const matchTemplate = document.querySelector("#match-template");
        matchesList.innerHTML = "";
        matches.forEach((match) => {
            const matchCard = matchTemplate.content.cloneNode(true);
            const placementSuffix = match.placement === 1 ? "st" : match.placement === 2 ? "nd" : match.placement === 3 ? "rd" : "th";
            const timeAlive = Math.floor(match.gameLength / 60);
            matchCard.querySelector(".match-placement").innerHTML = `${match.placement}<sup>${placementSuffix}</sup>`;
            matchCard.querySelector(".match-queue").textContent = match.queueId === 1100 ? "Ranked" : "Normal";
            matchCard.querySelector(".match-level").textContent = match.level;
            matchCard.querySelector(".match-time").textContent = `${timeAlive}m`;
            matchCard.querySelector(".match-damage").textContent = match.damage;
            matchCard.querySelector(".match-little-legend").textContent = match.companion?.content_ID || "Little Legend";
            const traitList = matchCard.querySelector(".trait-list");
            match.traits.forEach((trait) => {
                const traitElement = document.createElement("div");
                traitElement.classList.add("trait");
                traitElement.innerHTML = `
                    <span>${trait.name}</span>
                    <span>${trait.tier_current}</span>
                `;
                traitList.appendChild(traitElement);
            });
            const unitList = matchCard.querySelector(".unit-list");
            match.units.forEach((unit) => {
                const unitElement = document.createElement("div");
                unitElement.classList.add("unit");
                const unitImageContainer = document.createElement("div");
                unitImageContainer.classList.add("unit-image-container");
                const unitImage = document.createElement("img");
                unitImage.classList.add("unit-image");
                unitImage.src = unit.imageUrl;
                unitImage.alt = unit.name || unit.character_id;
                const unitTier = document.createElement("span");
                unitTier.classList.add("unit-tier");
                if (unit.tier === 1) {
                    unitTier.classList.add("one-star");
                } else if (unit.tier === 2) {
                    unitTier.classList.add("two-star");
                } else if (unit.tier === 3) {
                    unitTier.classList.add("three-star");
                }
                unitTier.textContent = "★".repeat(unit.tier || 0);
                unitImageContainer.appendChild(unitImage);
                unitImageContainer.appendChild(unitTier);
                const unitName = document.createElement("span");
                unitName.classList.add("unit-name");
                unitName.textContent = unit.name || unit.character_id.replace(/^DA_/, "").replace(/^18_/, "").replace(/18$/, "");
                const itemContainer = document.createElement("div");
                itemContainer.classList.add("unit-items");
                (unit.items || []).forEach((item) => {
                    const itemImage = document.createElement("img");
                    itemImage.classList.add("item-image");
                    itemImage.src = item.imageUrl;
                    itemImage.alt = item.name;
                    itemImage.title = item.name;
                    itemContainer.appendChild(itemImage);
                });
                unitElement.appendChild(unitImageContainer);
                unitElement.appendChild(unitName);
                unitElement.appendChild(itemContainer);
                unitList.appendChild(unitElement);
            });
            matchesList.appendChild(matchCard);
        });
    } catch (err) {
        console.error(err);
    }
}

loadStats();
loadMatches();