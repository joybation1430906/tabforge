const fs = require('fs');
const path = require('path');

const SCHEDULE_FILE = path.join(process.env.HOME || '~', '.tabforge', 'schedules.json');

function ensureScheduleFile() {
  const dir = path.dirname(SCHEDULE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(SCHEDULE_FILE)) fs.writeFileSync(SCHEDULE_FILE, JSON.stringify([]));
}

function loadSchedules() {
  ensureScheduleFile();
  return JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8'));
}

function saveSchedules(schedules) {
  ensureScheduleFile();
  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedules, null, 2));
}

function addSchedule(name, sessionName, cronExpr) {
  const schedules = loadSchedules();
  if (schedules.find(s => s.name === name)) throw new Error(`Schedule '${name}' already exists`);
  const entry = { name, sessionName, cron: cronExpr, createdAt: new Date().toISOString(), enabled: true };
  schedules.push(entry);
  saveSchedules(schedules);
  return entry;
}

function removeSchedule(name) {
  const schedules = loadSchedules();
  const idx = schedules.findIndex(s => s.name === name);
  if (idx === -1) throw new Error(`Schedule '${name}' not found`);
  const [removed] = schedules.splice(idx, 1);
  saveSchedules(schedules);
  return removed;
}

function getSchedule(name) {
  const schedules = loadSchedules();
  const entry = schedules.find(s => s.name === name);
  if (!entry) throw new Error(`Schedule '${name}' not found`);
  return entry;
}

function toggleSchedule(name, enabled) {
  const schedules = loadSchedules();
  const entry = schedules.find(s => s.name === name);
  if (!entry) throw new Error(`Schedule '${name}' not found`);
  entry.enabled = enabled;
  saveSchedules(schedules);
  return entry;
}

module.exports = { ensureScheduleFile, loadSchedules, saveSchedules, addSchedule, removeSchedule, getSchedule, toggleSchedule };
