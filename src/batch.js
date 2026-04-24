const fs = require('fs');
const path = require('path');
const os = require('os');

const BATCH_DIR = path.join(os.homedir(), '.tabforge', 'batches');

function ensureBatchDir() {
  if (!fs.existsSync(BATCH_DIR)) {
    fs.mkdirSync(BATCH_DIR, { recursive: true });
  }
}

function getBatchPath(name) {
  return path.join(BATCH_DIR, `${name}.json`);
}

function saveBatch(name, batch) {
  ensureBatchDir();
  fs.writeFileSync(getBatchPath(name), JSON.stringify(batch, null, 2));
}

function loadBatch(name) {
  const p = getBatchPath(name);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function listBatches() {
  ensureBatchDir();
  return fs.readdirSync(BATCH_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteBatch(name) {
  const p = getBatchPath(name);
  if (!fs.existsSync(p)) return false;
  fs.unlinkSync(p);
  return true;
}

function createBatch(name, sessions) {
  const batch = {
    name,
    sessions: sessions || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  saveBatch(name, batch);
  return batch;
}

function addSessionToBatch(name, session) {
  const batch = loadBatch(name);
  if (!batch) return null;
  batch.sessions.push(session);
  batch.updatedAt = new Date().toISOString();
  saveBatch(name, batch);
  return batch;
}

function removeSessionFromBatch(name, index) {
  const batch = loadBatch(name);
  if (!batch) return null;
  if (index < 0 || index >= batch.sessions.length) return null;
  batch.sessions.splice(index, 1);
  batch.updatedAt = new Date().toISOString();
  saveBatch(name, batch);
  return batch;
}

module.exports = {
  ensureBatchDir,
  getBatchPath,
  saveBatch,
  loadBatch,
  listBatches,
  deleteBatch,
  createBatch,
  addSessionToBatch,
  removeSessionFromBatch
};
