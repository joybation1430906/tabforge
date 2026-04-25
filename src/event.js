const fs = require('fs');
const path = require('path');
const os = require('os');

const EVENTS_DIR = path.join(os.homedir(), '.tabforge', 'events');

function ensureEventsDir() {
  if (!fs.existsSync(EVENTS_DIR)) {
    fs.mkdirSync(EVENTS_DIR, { recursive: true });
  }
}

function getEventPath(name) {
  return path.join(EVENTS_DIR, `${name}.json`);
}

function saveEvent(name, event) {
  ensureEventsDir();
  fs.writeFileSync(getEventPath(name), JSON.stringify(event, null, 2));
}

function loadEvent(name) {
  const p = getEventPath(name);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function listEvents() {
  ensureEventsDir();
  return fs.readdirSync(EVENTS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteEvent(name) {
  const p = getEventPath(name);
  if (!fs.existsSync(p)) return false;
  fs.unlinkSync(p);
  return true;
}

function renameEvent(oldName, newName) {
  const event = loadEvent(oldName);
  if (!event) return false;
  event.name = newName;
  saveEvent(newName, event);
  deleteEvent(oldName);
  return true;
}

module.exports = {
  ensureEventsDir,
  getEventPath,
  saveEvent,
  loadEvent,
  listEvents,
  deleteEvent,
  renameEvent
};
