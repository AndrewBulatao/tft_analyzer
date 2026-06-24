const mongoose = require("mongoose");

const Match = require("../models/Match");
const TrainingData = require("../models/TrainingData");

require("dotenv").config();

async function exportTrainingData() {
    await mongoose.connect(process.env.MONGO_URI);

    const matches = await Match.find();

    let inserted = 0;

    for (const match of matches) {
        const participants =
        match.matchData.info.participants;

        // Inserting player data into schema
        for (const p of participants) {

            await TrainingData.create({
                matchId: match.matchId,
                puuid: p.puuid,

                placement: p.placement,
                level: p.level,
                goldLeft: p.gold_left,
                playersEliminated: p.players_eliminated,
                totalDamage: p.total_damage_to_players,

                traits: (p.traits || []).map(trait => ({
                    name: trait.name,
                    numUnits: trait.numUnits || 0,
                    tier: trait.tier || 0
                })),

                units: (p.units || []).map(unit => ({
                    name: unit.character_id,
                    tier: unit.tier || 1,
                    items: unit.items || []
                }))
            });

            inserted++;
        }
    }

    console.log(
        `Inserted ${inserted} training rows`
    );

    process.exit();
}

exportTrainingData();