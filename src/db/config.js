/**
 * Database configuration — feature/database-connection branch.
 * Reads connection settings from environment variables with sensible
 * defaults. Centralised so the rest of the db module focuses on data access.
 */

const DEFAULTS = {
  host: "localhost",
  port: 5432,
  name: "csp451_dev",
  user: "app",
  poolMin: 1,
  poolMax: 5,
};

function readEnvInt(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getConfig() {
  return {
    host: process.env.DB_HOST || DEFAULTS.host,
    port: readEnvInt("DB_PORT", DEFAULTS.port),
    name: process.env.DB_NAME || DEFAULTS.name,
    user: process.env.DB_USER || DEFAULTS.user,
    pool: {
      min: readEnvInt("DB_POOL_MIN", DEFAULTS.poolMin),
      max: readEnvInt("DB_POOL_MAX", DEFAULTS.poolMax),
    },
  };
}

function validateConfig(config) {
  if (!config.host) throw new Error("DB_HOST is required");
  if (!config.name) throw new Error("DB_NAME is required");
  if (config.port < 1 || config.port > 65535) {
    throw new Error("DB_PORT must be between 1 and 65535");
  }
  if (config.pool.min > config.pool.max) {
    throw new Error("DB_POOL_MIN cannot exceed DB_POOL_MAX");
  }
  return true;
}

module.exports = { getConfig, validateConfig, DEFAULTS };
