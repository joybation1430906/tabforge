const fs = require('fs');
const path = require('path');
const os = require('os');

const PINS_FILE = path.join(os.homedir(), '.tabforge', 'pins.json');

function ensurePinsFile() {
  const dir = path.dirname(PINS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(PINS_FILE)) fs.writeFileSync(PINS_FILE, JSON.stringify([]));
}

function loadPins() {
  ensurePinsFile();
  return JSON.parse(fs.readFileSync(PINS_FILE, 'utf8'));
}

function savePins(pins) {
  ensurePinsFile();
  fs.writeFileSync(PINS_FILE, JSON.stringify(pins, null, 2));
}

function addPin(name, url, label = '') {
  const pins = loadPins();
  if (pins.find(p => p.name === name)) throw new Error(`Pin '${name}' already exists`);
  const pin = { name, url, label, createdAt: new Date().toISOString() };
  pins.push(pin);
  savePins(pins);
  return pin;
}

function removePin(name) {
  const pins = loadPins();
  const idx = pins.findIndex(p => p.name === name);
  if (idx === -1) throw new Error(`Pin '${name}' not found`);
  const [removed] = pins.splice(idx, 1);
  savePins(pins);
  return removed;
}

function getPin(name) {
  const pins = loadPins();
  const pin = pins.find(p => p.name === name);
  if (!pin) throw new Error(`Pin '${name}' not found`);
  return pin;
}

function searchPins(query) {
  const pins = loadPins();
  const q = query.toLowerCase();
  return pins.filter(p => p.name.toLowerCase().includes(q) || p.url.toLowerCase().includes(q) || p.label.toLowerCase().includes(q));
}

module.exports = { ensurePinsFile, loadPins, savePins, addPin, removePin, getPin, searchPins };
