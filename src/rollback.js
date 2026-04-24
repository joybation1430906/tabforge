// rollback.js — save and restore previous states of sessions/configs

const fs = require('fs');
const path = require('path');
const os = require('os');

const ROLLBACK_DIR = path.join(os.homedir(), '.tabforge', 'rollbacks');
const MAX_ROLLBACKS = 10;

function ensureRollbackDir() {
  if (!fs.existsSync(ROLLBACK_DIR)) {
    fs.mkdirSync(ROLLBACK_DIR, { recursive: true });
  }
}

function getRollbackPath(name) {
  return path.join(ROLLBACK_DIR, `${name}.json`);
}

/**
 * Load rollback stack for a given resource name.
 * Returns an array of snapshots, newest first.
 */
function loadRollbacks(name) {
  ensureRollbackDir();
  const file = getRollbackPath(name);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

/**
 * Persist rollback stack for a given resource name.
 */
function saveRollbacks(name, stack) {
  ensureRollbackDir();
  fs.writeFileSync(getRollbackPath(name), JSON.stringify(stack, null, 2));
}

/**
 * Push a new snapshot onto the rollback stack for `name`.
 * Trims the stack to MAX_ROLLBACKS entries.
 */
function pushRollback(name, data) {
  const stack = loadRollbacks(name);
  stack.unshift({
    timestamp: new Date().toISOString(),
    data,
  });
  if (stack.length > MAX_ROLLBACKS) {
    stack.splice(MAX_ROLLBACKS);
  }
  saveRollbacks(name, stack);
}

/**
 * Pop the most recent snapshot off the stack and return it.
 * Returns null if there is nothing to roll back to.
 */
function popRollback(name) {
  const stack = loadRollbacks(name);
  if (stack.length === 0) return null;
  const [latest, ...rest] = stack;
  saveRollbacks(name, rest);
  return latest;
}

/**
 * Peek at the most recent snapshot without removing it.
 */
function peekRollback(name) {
  const stack = loadRollbacks(name);
  return stack.length > 0 ? stack[0] : null;
}

/**
 * Clear all rollback history for a given resource name.
 */
function clearRollbacks(name) {
  const file = getRollbackPath(name);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

/**
 * List all resource names that have rollback history.
 */
function listRollbackTargets() {
  ensureRollbackDir();
  return fs
    .readdirSync(ROLLBACK_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

module.exports = {
  ensureRollbackDir,
  getRollbackPath,
  loadRollbacks,
  saveRollbacks,
  pushRollback,
  popRollback,
  peekRollback,
  clearRollbacks,
  listRollbackTargets,
};
