/**
 * Database module — feature/database-connection branch.
 * Implements connect() and getClient() backed by an in-memory client.
 * Configuration is loaded from environment variables via ./config.
 */
const { getConfig, validateConfig } = require("./config");

let client = null;

function connect() {
  if (client) return client;
  const config = getConfig();
  validateConfig(config);
  client = {
    connected: true,
    driver: "in-memory",
    config,
    connectedAt: new Date().toISOString(),
  };
  return client;
}

function getClient() {
  if (!client) {
    throw new Error("Database not connected. Call connect() first.");
  }
  return client;
}

function disconnect() {
  client = null;
}

module.exports = { connect, getClient, disconnect };
