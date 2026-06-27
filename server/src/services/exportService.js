const fs = require("fs");
const Match = require("../models/Match");

async function exportTraits(puuid, gameName) {

    const matches = await Match.find();

    const rows = [];

    // CSV Header
    rows.push([
        "Game",
        "Summoner",
        "Placement",
        "Trait",
        "Units",
        "Tier"
    ].join(","));

    let gameNumber = 1;

    for (const match of matches) {

        const participants = match.matchData.info.participants;

        const player = participants.find(
            p => p.puuid === puuid
        );

        if (!player) continue;

        for (const trait of player.traits || []) {

            rows.push([
                gameNumber,
                gameName,
                player.placement,
                trait.name,
                trait.num_units || 0,
                trait.tier_current || 0
            ].join(","));
        }

        gameNumber++;
    }

    const filePath = `${gameName}_traits.csv`;

    fs.writeFileSync(filePath, rows.join("\n"));

    return filePath;
}

module.exports = {
    exportTraits
};