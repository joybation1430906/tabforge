const fs = require('fs');
const path = require('path');
const os = require('os');

const QUEUE_DIR = path.join(os.homedir(), '.tabforge', 'queues');

function ensureQueueDir() {
  if (!fs.existsSync(QUEUE_DIR)) fs.mkdirSync(QUEUE_DIR, { recursive: true });
}

function saveQueue(name, items) {
  ensureQueueDir();
  const file = path.join(QUEUE_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify({ name, items, createdAt: Date.now() }, null, 2));
}

function loadQueue(name) {
  ensureQueueDir();
  const file = path.join(QUEUE_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listQueues() {
  ensureQueueDir();
  return fs.readdirSync(QUEUE_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteQueue(name) {
  const file = path.join(QUEUE_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return false;
  fs.unlinkSync(file);
  return true;
}

function addToQueue(name, url) {
  const queue = loadQueue(name) || { name, items: [], createdAt: Date.now() };
  queue.items.push({ url, addedAt: Date.now() });
  saveQueue(name, queue.items);
  return queue.items.length;
}

function removeFromQueue(name, index) {
  const queue = loadQueue(name);
  if (!queue) return false;
  if (index < 0 || index >= queue.items.length) return false;
  queue.items.splice(index, 1);
  saveQueue(name, queue.items);
  return true;
}

module.exports = { ensureQueueDir, saveQueue, loadQueue, listQueues, deleteQueue, addToQueue, removeFromQueue };
