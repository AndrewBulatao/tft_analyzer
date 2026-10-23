const tftDataService = require("./tftDataService");

// Count unit costs on the player's final board
function analyzeUnitCosts(units) {
    const costCounts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    };

    (units || []).forEach(unit => {
        const cost = Number(unit.cost);

        if (!Number.isFinite(cost) || cost < 1) {
            return;
        }

        // Print the counter before incrementing
        console.log(`Before: ${costCounts[cost]}`);

        // Increment the counter for this unit's cost
        costCounts[cost] = (costCounts[cost] || 0) + 1;

        // Print the counter after incrementing
        console.log(`After: ${costCounts[cost]}`);
        console.log(`Updated ${cost}-cost counter`);
        console.log("All counters:", costCounts);
    });

    return costCounts;
}
// TODO: check the level of units. number of units isnt what determines reroll

// Estimate the likely strategy from the final composition
async function inferLevelingStrategy(units, gameVersion) {
    const costCounts = analyzeUnitCosts(units);

    // Unit costs must be available to infer a strategy
    if (costCounts.knownCostCount === 0) {
        return {
            strategy: "undetermined",
            confidence: "low",
            reason: "Unit cost data is unavailable.",
            ...costCounts
        };
    }

    const counts = costCounts.costCounts;
    const oneAndTwoCostUnits = counts[1] + counts[2];

    // These rules are preliminary heuristics, not confirmed intent
    if (counts[1] >= 3 && counts[1] >= counts[2]) {
        return {
            strategy: "possible-one-cost-reroll",
            confidence: "low",
            reason:
                "The final board contains several one-cost units. " +
                "A one-cost reroll strategy is possible.",
            ...costCounts
        };
    }

    if (counts[2] >= 3 && counts[2] > counts[1]) {
        return {
            strategy: "possible-two-cost-reroll",
            confidence: "low",
            reason:
                "The final board contains several two-cost units. " +
                "A two-cost reroll strategy is possible.",
            ...costCounts
        };
    }

    if (
        counts[4] >= 2 &&
        counts[4] > oneAndTwoCostUnits
    ) {
        return {
            strategy: "leveling-oriented",
            confidence: "low",
            reason:
                "The final board contains several four-cost units. " +
                "A higher-level strategy may fit this composition.",
            ...costCounts
        };
    }

    if (counts[5] >= 2 && counts[5] > oneAndTwoCostUnits) {
        return {
            strategy: "high-cost-board",
            confidence: "low",
            reason:
                "The final board contains several five-cost units. " +
                "This may indicate a higher-level composition.",
            ...costCounts
        };
    }

    return {
        strategy: "mixed-cost",
        confidence: "low",
        reason:
            "The final unit costs do not clearly identify a reroll " +
            "or leveling-oriented strategy.",
        ...costCounts
    };
}

// Compare the player's final level with the other participants
function analyzeLobbyLevel(player, participants) {
    const levels = participants
        .map(participant => participant.level)
        .filter(Number.isFinite);

    const playerLevel = player.level;

    // Init levels
    if (!Number.isFinite(playerLevel) || levels.length < 2) {
        return {
            playerLevel: playerLevel ?? null,
            averageLobbyLevel: null,
            playersBelow: null,
            playersSameLevel: null,
            playersAbove: null,
            comparison: "unavailable"
        };
    }

    const playersBelow = levels.filter(
        level => level < playerLevel
    ).length;

    const playersSameLevel = levels.filter(
        level => level === playerLevel
    ).length;

    const playersAbove = levels.filter(
        level => level > playerLevel
    ).length;

    const averageLobbyLevel =
        levels.reduce((sum, level) => sum + level, 0) / levels.length;

    let comparison = "similar-to-lobby";

    if (playerLevel > averageLobbyLevel) {
        comparison = "above-lobby-average";
    } else if (playerLevel < averageLobbyLevel) {
        comparison = "below-lobby-average";
    }

    return {
        playerLevel,
        averageLobbyLevel: Number(averageLobbyLevel.toFixed(2)),
        playersBelow,
        playersSameLevel,
        playersAbove,
        comparison
    };
}

// Analyze the player's likely leveling strategy
async function analyzeLeveling(player, participants, gameVersion) {
    const composition = await inferLevelingStrategy(
        player.units || [],
        gameVersion
    );

    const lobbyComparison = analyzeLobbyLevel(
        player,
        participants
    );

    return {
        composition,
        lobbyComparison,
        limitations: [
            "Strategy is inferred from the final composition.",
            "Final data does not confirm when the player leveled or rerolled.",
            "Lobby comparison uses final levels, not levels at equivalent rounds."
        ]
    };
}

module.exports = {
    analyzeUnitCosts,
    inferLevelingStrategy,
    analyzeLobbyLevel,
    analyzeLeveling
};
