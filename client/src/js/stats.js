// Get player information from URL
const params = new URLSearchParams(window.location.search);
const gameName = params.get("gameName");
const tagLine = params.get("tagLine");

// Get player stats
async function loadStats() {
    // Try to get player stats
    try {
        const response = await fetch(`http://localhost:3000/player-stats/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
        
        // Check if the server returned an error
        if (!response.ok) {
            throw new Error("Failed to fetch player stats");
        }
        
        // Get the data from the server
        const data = await response.json();
        const stats = data.playerStats;
        console.log(data);
        console.log(data.playerStats);
        console.log(stats.avgLevel);

        // Display player name
        document.querySelector("#header_summoner").textContent = `${gameName} #${tagLine}`;
        
        // Display player stats
        document.querySelector("#total-games").textContent = stats.totalGames;
        document.querySelector("#average-placement").textContent = stats.avgPlacement;
        document.querySelector("#top-four-rate").textContent = `${(stats.top4Rate * 100).toFixed(1)}%`;
        document.querySelector("#average-level").textContent = stats.avgLevel.toFixed(1);
        document.querySelector("#average-gold").textContent = stats.avgGoldLeft.toFixed(1);
        document.querySelector("#average-damage").textContent = stats.avgDamage.toFixed(1);
    } catch (err) {
        console.error(err);
        
        // Show error message
        document.querySelector("#header_summoner").textContent = "Failed to load player stats";
    }
}

// Get player's recent matches
async function loadMatches() {
    // Try to get recent matches
    try {
        const response = await fetch(`http://localhost:3000/match-stats/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
        // Check if the server returned an error
        if (!response.ok) {
            throw new Error("Failed to fetch match stats");
        }
        
        // Get the match data from the server
        const matches = await response.json();
        
        // Get the match list and template from the page
        const matchesList = document.querySelector("#matches-list");
        const matchTemplate = document.querySelector("#match-template");
        
        // Clear existing matches
        matchesList.innerHTML = "";
        
        // Go through each match
        matches.forEach((match) => {
            // Copy the match template
            const matchCard = matchTemplate.content.cloneNode(true);
            
            // Get the placement suffix
            const placementSuffix = match.placement === 1 ? "st" : match.placement === 2 ? "nd" : match.placement === 3 ? "rd" : "th";
            
            // Convert game length from seconds to minutes
            const timeAlive = Math.floor(match.gameLength / 60);
            
            // Display match information
            matchCard.querySelector(".match-placement").innerHTML = `${match.placement}<sup>${placementSuffix}</sup>`;
            matchCard.querySelector(".match-queue").textContent = match.queueId === 1100 ? "Ranked" : "Normal";
            matchCard.querySelector(".match-level").textContent = match.level;
            matchCard.querySelector(".match-time").textContent = `${timeAlive}m`;
            matchCard.querySelector(".match-damage").textContent = match.damage;
            
            
            // Get the trait list
            const traitList = matchCard.querySelector(".trait-list");
            // Go through each trait
            match.traits.forEach((trait) => {
                // Create the trait element
                const traitElement = document.createElement("div");
                traitElement.classList.add("trait");
                console.log("TRAIT NAME:", trait.name);
                console.log("TRAIT ELEMENT:", traitElement);
                traitElement.title = trait.name;

                // Create the trait image
                const traitImage = document.createElement("img");
                traitImage.classList.add("trait-image");
                traitImage.src = trait.imageUrl;

                traitImage.alt = trait.name;
                // Create the trait tier
                const traitTier = document.createElement("span");
                traitTier.classList.add("trait-tier");

                // Set the trait tier color
                if (trait.tier_current === 1) {
                    traitTier.classList.add("one-star");
                } else if (trait.tier_current === 2) {
                    traitTier.classList.add("two-star");
                } else if (trait.tier_current === 3) {
                    traitTier.classList.add("three-star");
                }

                traitTier.textContent = trait.tier_current;

                // Add the trait image and tier
                traitElement.appendChild(traitImage);
                traitElement.appendChild(traitTier);

                // Add the trait to the trait list
                traitList.appendChild(traitElement);
            });

            
            // Get the unit list
            const unitList = matchCard.querySelector(".unit-list");
            
            // Go through each unit
            match.units.forEach((unit) => {
                // Create the unit element
                const unitElement = document.createElement("div");
                unitElement.classList.add("unit");
                
                // Create the unit image container
                const unitImageContainer = document.createElement("div");
                unitImageContainer.classList.add("unit-image-container");
                
                // Create the unit image
                const unitImage = document.createElement("img");
                unitImage.classList.add("unit-image");
                unitImage.src = unit.imageUrl;
                unitImage.alt = unit.name || unit.character_id;
                
                // Create the unit star level
                const unitTier = document.createElement("span");
                unitTier.classList.add("unit-tier");
                
                // Set the star level color
                if (unit.tier === 1) {
                    unitTier.classList.add("one-star");
                } else if (unit.tier === 2) {
                    unitTier.classList.add("two-star");
                } else if (unit.tier === 3) {
                    unitTier.classList.add("three-star");
                }
                unitTier.textContent = "★".repeat(unit.tier || 0);
                
                // Add the unit image and star level
                unitImageContainer.appendChild(unitImage);
                unitImageContainer.appendChild(unitTier);
                
                // Create the unit name
                const unitName = document.createElement("span");
                unitName.classList.add("unit-name");
                unitName.textContent = unit.name || unit.character_id.replace(/^DA_/, "").replace(/^18_/, "").replace(/18$/, "");
                
                // Create the item container
                const itemContainer = document.createElement("div");
                itemContainer.classList.add("unit-items");
                
                // Go through each item on the unit
                (unit.items || []).forEach((item) => {
                    // Create the item image
                    const itemImage = document.createElement("img");
                    itemImage.classList.add("item-image");
                    itemImage.src = item.imageUrl;
                    itemImage.alt = item.name;
                    itemImage.title = item.name;
                    itemContainer.appendChild(itemImage);
                });
                // Add unit elements together
                unitElement.appendChild(unitImageContainer);

                unitElement.appendChild(unitName);
                unitElement.appendChild(itemContainer);

                // Add the unit to the unit list
                unitList.appendChild(unitElement);
            });
            // Add the completed match to the page
            matchesList.appendChild(matchCard);
        });
    } catch (err) {
        console.error(err);
    }
}

// Load player stats and recent matches
loadStats();
loadMatches();