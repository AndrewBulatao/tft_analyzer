const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");

const PlayerStats = require("../models/playerStats");

router.get("/traits/:puuid", async (req, res) => {
    try {
        const { puuid } = req.params;

        const stats = await PlayerStats.findOne({ puuid });

        if (!stats) {
            return res.status(404).json({ error: "No stats found" });
        }

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Trait Stats");

        sheet.columns = [
            { header: "Trait", key: "trait" },
            { header: "Games", key: "games" },
            { header: "Win Rate", key: "winRate" },
            { header: "Top 4 Rate", key: "top4Rate" },
            { header: "Avg Placement", key: "avgPlacement" },
            { header: "Activation Rate", key: "activationRate" }
        ];

        for (const name in stats.traitStats) {
            const t = stats.traitStats[name];

            sheet.addRow({
                trait: name,
                games: t.games,
                winRate: t.winRate,
                top4Rate: t.top4Rate,
                avgPlacement: t.avgPlacement,
                activationRate: t.activationRate
            });
        }

        // Set headers so curl downloads file
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=traits_${puuid}.xlsx`
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Excel generation failed" });
    }
});

module.exports = router;