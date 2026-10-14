// Retrieve match data and process trait and unit statistics
// for all participants, then return the match metadata,
// requested player's placement, and participant statistics as JSON.
const matchService = require("./matchService");
const traitService = require("./traitService");
const unitStatsService = require("./unitStatsService");

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
        return null;
    }

    // Analyze each participant in the match
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
            placement: requestedPlayer.placement
        },
        participants: participantReports
    };
}

module.exports = {
    getMatchReport
};
