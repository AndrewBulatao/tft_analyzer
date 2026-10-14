
 // Get player information from URL
const params = new URLSearchParams(window.location.search);
const gameName = params.get("gameName");
const tagLine = params.get("tagLine");

// Get player stats
async function loadStats() {
    // Try to get player stats
    try {
        const response = await fetch(
            `http://localhost:3000/player-stats/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
        );

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
        document.querySelector("#header_summoner").textContent =
            `${gameName} #${tagLine}`;

        // Display player stats
        document.querySelector("#total-games").textContent = stats.totalGames;
        document.querySelector("#average-placement").textContent = stats.avgPlacement;
        document.querySelector("#top-four-rate").textContent =
            `${(stats.top4Rate * 100).toFixed(1)}%`;
        document.querySelector("#average-level").textContent = stats.avgLevel.toFixed(1);
        document.querySelector("#average-gold").textContent = stats.avgGoldLeft.toFixed(1);
        document.querySelector("#average-damage").textContent = stats.avgDamage.toFixed(1);
    } catch (err) {
        console.error(err);

        // Show error message
        document.querySelector("#header_summoner").textContent =
            "Failed to load player stats";
    }
}

// Get player's recent matches
async function loadMatches() {
    // Try to get recent matches
    try {
        const response = await fetch(
            `http://localhost:3000/match-stats/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
        );

        // Check if the server returned an error
        if (!response.ok) {
            throw new Error("Failed to fetch match stats");
        }

        // Get the match data from the server
        const matches = await response.json();

        // Get the player's PUUID
        const puuid = await getPlayerPuuid();

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
            const placementSuffix =
                match.placement === 1 ? "st" :
                match.placement === 2 ? "nd" :
                match.placement === 3 ? "rd" : "th";

            // Convert game length from seconds to minutes
            const timeAlive = Math.floor(match.gameLength / 60);

            // Display match information
            matchCard.querySelector(".match-placement").innerHTML =
                `${match.placement}<sup>${placementSuffix}</sup>`;

            matchCard.querySelector(".match-queue").textContent =
                match.queueId === 1100 ? "Ranked" : "Normal";

            matchCard.querySelector(".match-level").textContent = match.level;
            matchCard.querySelector(".match-time").textContent = `${timeAlive}m`;
            matchCard.querySelector(".match-damage").textContent = match.damage;

            // Get the trait list
            const traitList = matchCard.querySelector(".trait-list");

            // Go through each trait
            (match.traits || []).forEach((trait) => {
                // Create the trait element
                const traitElement = document.createElement("div");
                traitElement.classList.add("trait");
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
            (match.units || []).forEach((unit) => {
                // Create the unit element
                const unitElement = document.createElement("div");
                unitElement.classList.add("unit");

                // Create the unit image
                const unitImage = document.createElement("img");
                unitImage.classList.add("unit-image");
                unitImage.src = unit.imageUrl;
                unitImage.alt = unit.name || unit.character_id;

                // Create the hover information
                const unitInfo = document.createElement("div");
                unitInfo.classList.add("unit-info");

                // Create the unit name
                const unitName = document.createElement("span");
                unitName.classList.add("unit-name");

                let displayName = unit.name || unit.character_id;
                displayName = displayName.replace(/^TFT_/, "");
                displayName = displayName.replace(/^TFT\d+_/, "");
                displayName = displayName.replace(/1*$/, "");
                displayName = displayName.replace(/_AP*$/, "");
                displayName = displayName.replace(/_AD*$/, "");
                unitName.textContent = displayName;

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

                // Add the name and items
                unitInfo.appendChild(unitName);
                unitInfo.appendChild(itemContainer);

                // Add the image and hover information
                unitElement.appendChild(unitImage);
                unitElement.appendChild(unitInfo);

                // Add the unit to the unit list
                unitList.appendChild(unitElement);
            });

            // Get the match card element before appending the template
            const cardElement = matchCard.firstElementChild;

            // Add the completed match to the page
            matchesList.appendChild(matchCard);

            // Create the match report button
            const reportButton = document.createElement("button");
            reportButton.textContent = "View Match Report";
            reportButton.classList.add("match-report-button");

            // Create the container for the report
            const reportContainer = document.createElement("div");
            reportContainer.classList.add("match-report-container");
            reportContainer.hidden = true;

            // Add the button and report to the match card
            if (cardElement) {
                cardElement.appendChild(reportButton);
                cardElement.appendChild(reportContainer);
            }

            // Show or hide the match report
            reportButton.addEventListener("click", async () => {
                if (!reportContainer.hidden) {
                    reportContainer.hidden = true;
                    reportButton.textContent = "View Match Report";
                    return;
                }

                reportContainer.hidden = false;
                reportButton.textContent = "Hide Match Report";

                // Load the report only once
                if (reportContainer.dataset.loaded !== "true") {
                    const loaded = await loadMatchReport(
                        match.matchId,
                        puuid,
                        reportContainer
                    );

                    if (loaded) {
                        reportContainer.dataset.loaded = "true";
                    }
                }
            });
        });
    } catch (err) {
        console.error(err);
    }
}

// Get player's PUUID
async function getPlayerPuuid() {
    const response = await fetch(
        `http://localhost:3000/account/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch player account");
    }

    const account = await response.json();
    return account.puuid;
}

// Load the match report
async function loadMatchReport(matchId, puuid, reportContainer) {
    reportContainer.textContent = "Loading match report...";

    try {
        const response = await fetch(
            `http://localhost:3000/match-report/${encodeURIComponent(matchId)}/${encodeURIComponent(puuid)}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch match report");
        }

        const report = await response.json();

        // Clear the loading message
        reportContainer.innerHTML = "";

        // Display report heading
        const heading = document.createElement("h3");
        heading.textContent = "Match Report";
        reportContainer.appendChild(heading);

        // Display each participant, sorted by placement
        report.participants
            .sort((a, b) => a.placement - b.placement)
            .forEach((participant) => {
                const playerElement = document.createElement("div");
                playerElement.classList.add("report-participant");

                const playerHeading = document.createElement("h4");
                playerHeading.textContent =
                    `Placement: ${participant.placement} | Level: ${participant.level}`;

                playerElement.appendChild(playerHeading);

                // Display active traits
                const traits = document.createElement("p");
                traits.textContent =
                    "Active Traits: " +
                    (participant.traits.length
                        ? participant.traits.map((trait) => trait.name).join(", ")
                        : "None");

                playerElement.appendChild(traits);

                // Display units and their items
                const units = document.createElement("p");
                units.textContent =
                    "Units: " +
                    (participant.units.length
                        ? participant.units.map((unit) => {
                            const name = unit.name || unit.character_id;
                            const items = (unit.itemNames || []).join(", ");

                            return items ? `${name} (${items})` : name;
                        }).join(", ")
                        : "None");

                playerElement.appendChild(units);
                reportContainer.appendChild(playerElement);
            });

        return true;
    } catch (err) {
        console.error("Match report error:", err);
        reportContainer.textContent = "Failed to load match report.";
        return false;
    }
}

// Load player stats and recent matches
loadStats();
loadMatches();
