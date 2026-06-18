const express = require("express");
const { validateCredentials } = require("../services/auth");

const router = express.Router();

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  const result = validateCredentials(email, password);
  if (!result.ok) {
    return res.status(401).json({ ok: false, error: result.reason });
  }
  return res.json({ ok: true, user: result.user });
});

module.exports = { router };
