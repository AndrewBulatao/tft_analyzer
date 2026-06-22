const express = require("express");
const router = express.Router();

const playerService = require("../services/playerService");

router.get("/test/player/:gameName/:tagLine", async (req, res) => {
  try {
    const { gameName, tagLine } = req.params;

    const player = await playerService.getPlayerByRiotId(
      gameName,
      tagLine
    );

    res.json(player);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


module.exports = router;