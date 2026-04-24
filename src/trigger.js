const fs = require('fs');
const path = require('path');
const os = require('os');

const TRIGGERS_FILE = path.join(os.homedir(), '.tabforge', 'triggers.json');

function ensureTriggersFile() {
  const dir = path.dirname(TRIGGERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(TRIGGERS_FILE)) fs.writeFileSync(TRIGGERS_FILE, JSON.stringify([]));
}

function loadTriggers() {
  ensureTriggersFile();
  return JSON.parse(fs.readFileSync(TRIGGERS_FILE, 'utf8'));
}

function saveTriggers(triggers) {
  ensureTriggersFile();
  fs.writeFileSync(TRIGGERS_FILE, JSON.stringify(triggers, null, 2));
}

function addTrigger(name, event, target, options = {}) {
  const triggers = loadTriggers();
  if (triggers.find(t => t.name === name)) {
    throw new Error(`Trigger '${name}' already exists`);
  }
  const trigger = { name, event, target, enabled: true, createdAt: new Date().toISOString(), ...options };
  triggers.push(trigger);
  saveTriggers(triggers);
  return trigger;
}

function removeTrigger(name) {
  const triggers = loadTriggers();
  const idx = triggers.findIndex(t => t.name === name);
  if (idx === -1) throw new Error(`Trigger '${name}' not found`);
  const removed = triggers.splice(idx, 1)[0];
  saveTriggers(triggers);
  return removed;
}

function getTrigger(name) {
  const triggers = loadTriggers();
  const trigger = triggers.find(t => t.name === name);
  if (!trigger) throw new Error(`Trigger '${name}' not found`);
  return trigger;
}

function toggleTrigger(name) {
  const triggers = loadTriggers();
  const trigger = triggers.find(t => t.name === name);
  if (!trigger) throw new Error(`Trigger '${name}' not found`);
  trigger.enabled = !trigger.enabled;
  saveTriggers(triggers);
  return trigger;
}

function getTriggersForEvent(event) {
  return loadTriggers().filter(t => t.event === event && t.enabled);
}

module.exports = {
  ensureTriggersFile, loadTriggers, saveTriggers,
  addTrigger, removeTrigger, getTrigger, toggleTrigger, getTriggersForEvent
};
