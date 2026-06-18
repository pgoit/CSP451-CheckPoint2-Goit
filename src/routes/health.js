const express = require("express");

const router = express.Router();

/**
 * GET /api/health — service liveness probe.
 * Returns uptime so monitoring tools can detect restarts.
 */
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
  });
});

module.exports = router;
