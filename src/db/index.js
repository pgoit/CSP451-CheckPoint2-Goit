/**
 * Database module — feature/database-connection branch.
 * Implements connect(), getClient(), query(), insert(), and disconnect()
 * backed by an in-memory store. Configuration is loaded from environment
 * variables via ./config.
 */
const { getConfig, validateConfig } = require("./config");

let client = null;

const store = {
  users: [
    { id: 1, email: "student@example.com", role: "student" },
    { id: 2, email: "admin@example.com", role: "admin" },
  ],
  items: [],
};

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

function ensureTable(table) {
  if (!Object.prototype.hasOwnProperty.call(store, table)) {
    throw new Error(`Unknown table: ${table}`);
  }
}

function query(table, predicate) {
  if (!client) connect();
  ensureTable(table);
  const rows = store[table];
  if (typeof predicate === "function") {
    return rows.filter(predicate);
  }
  return [...rows];
}

function insert(table, record) {
  if (!client) connect();
  ensureTable(table);
  const id = store[table].length + 1;
  const row = { id, ...record };
  store[table].push(row);
  return row;
}

function disconnect() {
  client = null;
}

module.exports = { connect, getClient, query, insert, disconnect };
