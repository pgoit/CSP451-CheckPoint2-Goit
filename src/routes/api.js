const express = require("express");
const healthRouter = require("./health");
const itemsRouter = require("./items");

const router = express.Router();

// Sub-routers — each feature lives in its own file.
router.use("/health", healthRouter);
router.use("/items", itemsRouter);

module.exports = { router };
