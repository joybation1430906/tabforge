const fs = require('fs');
const path = require('path');
const os = require('os');

const MILESTONES_DIR = path.join(os.homedir(), '.tabforge', 'milestones');

function ensureMilestonesDir() {
  if (!fs.existsSync(MILESTONES_DIR)) {
    fs.mkdirSync(MILESTONES_DIR, { recursive: true });
  }
}

function getMilestonePath(name) {
  return path.join(MILESTONES_DIR, `${name}.json`);
}

function saveMilestone(name, data) {
  ensureMilestonesDir();
  const milestone = { name, createdAt: new Date().toISOString(), ...data };
  fs.writeFileSync(getMilestonePath(name), JSON.stringify(milestone, null, 2));
  return milestone;
}

function loadMilestone(name) {
  const p = getMilestonePath(name);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function listMilestones() {
  ensureMilestonesDir();
  return fs.readdirSync(MILESTONES_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteMilestone(name) {
  const p = getMilestonePath(name);
  if (!fs.existsSync(p)) return false;
  fs.unlinkSync(p);
  return true;
}

function renameMilestone(oldName, newName) {
  const data = loadMilestone(oldName);
  if (!data) return false;
  saveMilestone(newName, { ...data, name: newName });
  deleteMilestone(oldName);
  return true;
}

module.exports = {
  ensureMilestonesDir,
  getMilestonePath,
  saveMilestone,
  loadMilestone,
  listMilestones,
  deleteMilestone,
  renameMilestone
};
