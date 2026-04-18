const fs = require('fs');
const path = require('path');
const os = require('os');

const PROFILES_DIR = path.join(os.homedir(), '.tabforge', 'profiles');

function ensureProfilesDir() {
  if (!fs.existsSync(PROFILES_DIR)) {
    fs.mkdirSync(PROFILES_DIR, { recursive: true });
  }
  return PROFILES_DIR;
}

function saveProfile(name, config) {
  ensureProfilesDir();
  const filePath = path.join(PROFILES_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
  return filePath;
}

function loadProfile(name) {
  const filePath = path.join(PROFILES_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Profile '${name}' not found`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listProfiles() {
  ensureProfilesDir();
  return fs.readdirSync(PROFILES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteProfile(name) {
  const filePath = path.join(PROFILES_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Profile '${name}' not found`);
  }
  fs.unlinkSync(filePath);
}

function profileExists(name) {
  const filePath = path.join(PROFILES_DIR, `${name}.json`);
  return fs.existsSync(filePath);
}

module.exports = { ensureProfilesDir, saveProfile, loadProfile, listProfiles, deleteProfile, profileExists, PROFILES_DIR };
