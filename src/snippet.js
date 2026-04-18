const fs = require('fs');
const path = require('path');
const os = require('os');

const SNIPPETS_FILE = path.join(os.homedir(), '.tabforge', 'snippets.json');

function ensureSnippetsFile() {
  const dir = path.dirname(SNIPPETS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(SNIPPETS_FILE)) fs.writeFileSync(SNIPPETS_FILE, JSON.stringify([]));
}

function loadSnippets() {
  ensureSnippetsFile();
  return JSON.parse(fs.readFileSync(SNIPPETS_FILE, 'utf8'));
}

function saveSnippets(snippets) {
  ensureSnippetsFile();
  fs.writeFileSync(SNIPPETS_FILE, JSON.stringify(snippets, null, 2));
}

function addSnippet(name, urls, tags = []) {
  const snippets = loadSnippets();
  if (snippets.find(s => s.name === name)) {
    throw new Error(`Snippet '${name}' already exists`);
  }
  const snippet = { name, urls, tags, createdAt: new Date().toISOString() };
  snippets.push(snippet);
  saveSnippets(snippets);
  return snippet;
}

function removeSnippet(name) {
  const snippets = loadSnippets();
  const idx = snippets.findIndex(s => s.name === name);
  if (idx === -1) throw new Error(`Snippet '${name}' not found`);
  const removed = snippets.splice(idx, 1)[0];
  saveSnippets(snippets);
  return removed;
}

function getSnippet(name) {
  const snippets = loadSnippets();
  const snippet = snippets.find(s => s.name === name);
  if (!snippet) throw new Error(`Snippet '${name}' not found`);
  return snippet;
}

function listSnippets() {
  return loadSnippets();
}

module.exports = { ensureSnippetsFile, loadSnippets, saveSnippets, addSnippet, removeSnippet, getSnippet, listSnippets };
