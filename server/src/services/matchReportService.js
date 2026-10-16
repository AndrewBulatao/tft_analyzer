
const matchService = require("./matchService");
const traitService = require("./traitService");
const unitStatsService = require("./unitStatsService");
const levelingService = require("./levelingService");

// Calculate a percentile score relative to the other participants
function calculatePercentile(value, participants, field) {
    const values = participants
        .map(player => player[field])
        .filter(Number.isFinite);

    if (!Number.isFinite(value) || values.length < 2) {
        return null;
    }

    const lowerValues = values.filter(
        participantValue => participantValue < value
    ).length;

    return Math.round(
        (lowerValues / (values.length - 1)) * 100
    );
}

// Calculate the searched player's Combat score
function calculateCombatScore(player, participants) {
    const placement = player.placement;
    const participantCount = participants.length;

    // Calculate placement score, where a higher placement is better
    const placementScore =
        Number.isFinite(placement) && participantCount > 1
            ? ((participantCount - placement) / (participantCount - 1)) * 100
            : null;

    // Compare damage and eliminations against the lobby
    const damageScore = calculatePercentile(
        player.total_damage_to_players,
        participants,
        "total_damage_to_players"
    );

    const eliminationScore = calculatePercentile(
        player.players_eliminated,
        participants,
        "players_eliminated"
    );

    // Use only metrics with available data
    const components = [
        { score: placementScore, weight: 0.5 },
        { score: damageScore, weight: 0.3 },
        { score: eliminationScore, weight: 0.2 }
    ].filter(component => component.score !== null);

    // Return null if no usable metrics are available
    if (components.length === 0) {
        return null;
    }

    // Redistribute weights when a metric is unavailable
    const totalWeight = components.reduce(
        (sum, component) => sum + component.weight,
        0
    );

    const weightedScore = components.reduce(
        (sum, component) =>
            sum + component.score * component.weight,
        0
    );

    return Math.round(weightedScore / totalWeight);
}

async function getMatchReport(matchId, puuid) {
    // Retrieve match data from cache or Riot API
    const match = await matchService.getMatchWithCache(matchId);

    // Make sure match data exists
    if (!match || !match.info || !match.info.participants) {
        return null;
    }

    const participants = match.info.participants;

    // Find the player whose match report is requested
    const requestedPlayer = participants.find(
        player => player.puuid === puuid
    );

    // Make sure the requested player participated in this match
    if (!requestedPlayer) {
        console.log("Requested player was not found in match:", {
            matchId,
            puuid
        });
        return null;
    }

    // Calculate Combat score for the searched player
    const combatScore = calculateCombatScore(
        requestedPlayer,
        participants
    );

    // Analyze the player's likely leveling strategy
    const levelingAnalysis = await levelingService.analyzeLeveling(
        requestedPlayer,
        participants,
        match.info.game_version
    );

    // Analyze each participant for existing trait and unit statistics
    const participantReports = participants.map(player => {
        const traitStats = {};
        const unitStats = {};

        // Process trait statistics for this participant
        traitService.processTraits(
            traitStats,
            player,
            player.placement
        );

        // Process unit statistics for this participant
        unitStatsService.processUnits(
            unitStats,
            player,
            player.placement
        );

        return {
            puuid: player.puuid,
            placement: player.placement,
            level: player.level,
            goldLeft: player.gold_left,
            totalDamageToPlayers: player.total_damage_to_players,
            playersEliminated: player.players_eliminated,
            traits: (player.traits || []).filter(
                trait => trait.tier_current > 0
            ),
            units: player.units || [],
            traitStats,
            unitStats
        };
    });

    // Return the complete match report
    return {
        matchId,
        gameVersion: match.info.game_version,
        gameLength: match.info.game_length,
        queueId: match.info.queue_id,
        gameType: match.info.tft_game_type,
        requestedPlayer: {
            puuid: requestedPlayer.puuid,
            placement: requestedPlayer.placement,
            level: requestedPlayer.level,
            goldLeft: requestedPlayer.gold_left,
            totalDamageToPlayers: requestedPlayer.total_damage_to_players,
            playersEliminated: requestedPlayer.players_eliminated,
            combatScore,
            levelingAnalysis
        },
        participants: participantReports
    };
}

module.exports = {
    getMatchReport
};
