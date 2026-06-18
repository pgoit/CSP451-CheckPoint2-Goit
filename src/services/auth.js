// Minimal in-memory auth service for CK2 (no real crypto — checkpoint scope).
const MIN_PASSWORD_LENGTH = 6;

const USERS = [
  { email: "student@example.com", password: "password123" },
];

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function findUser(email) {
  const needle = normalizeEmail(email);
  if (!needle) return null;
  return USERS.find((u) => u.email.toLowerCase() === needle) || null;
}

function validateCredentials(email, password) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    return { ok: false, reason: "Email and password are required." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      reason: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  const user = findUser(normalizedEmail);
  if (!user || user.password !== password) {
    return { ok: false, reason: "Invalid email or password." };
  }
  return { ok: true, user: { email: user.email } };
}

module.exports = { validateCredentials, findUser, normalizeEmail, MIN_PASSWORD_LENGTH };
