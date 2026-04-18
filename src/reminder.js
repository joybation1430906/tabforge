const fs = require('fs');
const path = require('path');
const os = require('os');

const REMINDERS_FILE = path.join(os.homedir(), '.tabforge', 'reminders.json');

function ensureRemindersFile() {
  const dir = path.dirname(REMINDERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(REMINDERS_FILE)) fs.writeFileSync(REMINDERS_FILE, JSON.stringify([]));
}

function loadReminders() {
  ensureRemindersFile();
  return JSON.parse(fs.readFileSync(REMINDERS_FILE, 'utf8'));
}

function saveReminders(reminders) {
  ensureRemindersFile();
  fs.writeFileSync(REMINDERS_FILE, JSON.stringify(reminders, null, 2));
}

function addReminder(name, url, message, remindAt) {
  const reminders = loadReminders();
  if (reminders.find(r => r.name === name)) throw new Error(`Reminder '${name}' already exists`);
  const reminder = { name, url, message, remindAt, createdAt: new Date().toISOString(), active: true };
  reminders.push(reminder);
  saveReminders(reminders);
  return reminder;
}

function removeReminder(name) {
  const reminders = loadReminders();
  const idx = reminders.findIndex(r => r.name === name);
  if (idx === -1) throw new Error(`Reminder '${name}' not found`);
  const [removed] = reminders.splice(idx, 1);
  saveReminders(reminders);
  return removed;
}

function getDueReminders() {
  const reminders = loadReminders();
  const now = new Date();
  return reminders.filter(r => r.active && new Date(r.remindAt) <= now);
}

function toggleReminder(name) {
  const reminders = loadReminders();
  const reminder = reminders.find(r => r.name === name);
  if (!reminder) throw new Error(`Reminder '${name}' not found`);
  reminder.active = !reminder.active;
  saveReminders(reminders);
  return reminder;
}

module.exports = { ensureRemindersFile, loadReminders, saveReminders, addReminder, removeReminder, getDueReminders, toggleReminder };
