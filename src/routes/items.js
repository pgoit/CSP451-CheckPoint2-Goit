const express = require("express");

const router = express.Router();

// In-memory store — swappable with the db module on a later merge.
const items = [];
let nextId = 1;

function validateItemPayload(body) {
  const errors = [];
  if (!body || typeof body !== "object") {
    errors.push("Request body must be a JSON object.");
    return errors;
  }
  if (typeof body.name !== "string" || body.name.trim() === "") {
    errors.push("Field 'name' is required and must be a non-empty string.");
  } else if (body.name.length > 100) {
    errors.push("Field 'name' must be 100 characters or fewer.");
  }
  if (body.quantity !== undefined) {
    if (typeof body.quantity !== "number" || !Number.isFinite(body.quantity)) {
      errors.push("Field 'quantity' must be a number when provided.");
    } else if (body.quantity < 0) {
      errors.push("Field 'quantity' cannot be negative.");
    }
  }
  return errors;
}

// GET /api/items — list all items
router.get("/", (req, res) => {
  res.json({ ok: true, count: items.length, items });
});

// GET /api/items/:id — fetch one
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ ok: false, error: "Invalid id." });
  }
  const item = items.find((it) => it.id === id);
  if (!item) {
    return res.status(404).json({ ok: false, error: "Item not found." });
  }
  res.json({ ok: true, item });
});

// POST /api/items — create a new item with validation
router.post("/", (req, res) => {
  const errors = validateItemPayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ ok: false, errors });
  }
  const item = {
    id: nextId++,
    name: req.body.name.trim(),
    quantity: req.body.quantity === undefined ? 1 : req.body.quantity,
    createdAt: new Date().toISOString(),
  };
  items.push(item);
  res.status(201).json({ ok: true, item });
});

module.exports = router;
