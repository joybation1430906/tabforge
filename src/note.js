const fs = require('fs');
const path = require('path');
const os = require('os');

const NOTES_FILE = path.join(os.homedir(), '.tabforge', 'notes.json');

function ensureNotesFile() {
  const dir = path.dirname(NOTES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(NOTES_FILE)) fs.writeFileSync(NOTES_FILE, JSON.stringify([]));
}

function loadNotes() {
  ensureNotesFile();
  return JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8'));
}

function saveNotes(notes) {
  ensureNotesFile();
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
}

function addNote(url, text) {
  const notes = loadNotes();
  const existing = notes.find(n => n.url === url);
  if (existing) {
    existing.text = text;
    existing.updatedAt = new Date().toISOString();
  } else {
    notes.push({ url, text, createdAt: new Date().toISOString() });
  }
  saveNotes(notes);
  return notes;
}

function removeNote(url) {
  const notes = loadNotes();
  const filtered = notes.filter(n => n.url !== url);
  if (filtered.length === notes.length) throw new Error(`No note found for: ${url}`);
  saveNotes(filtered);
  return filtered;
}

function getNote(url) {
  const notes = loadNotes();
  return notes.find(n => n.url === url) || null;
}

function listNotes() {
  return loadNotes();
}

module.exports = { ensureNotesFile, loadNotes, saveNotes, addNote, removeNote, getNote, listNotes };
