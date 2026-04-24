const fs = require('fs');
const path = require('path');
const os = require('os');

const LOCK_DIR = path.join(os.homedir(), '.tabforge', 'locks');

function ensureLocksDir() {
  if (!fs.existsSync(LOCK_DIR)) {
    fs.mkdirSync(LOCK_DIR, { recursive: true });
  }
}

function getLockPath(name) {
  return path.join(LOCK_DIR, `${name}.lock`);
}

function acquireLock(name) {
  ensureLocksDir();
  const lockPath = getLockPath(name);
  if (fs.existsSync(lockPath)) {
    const data = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    return { acquired: false, lockedBy: data.pid, since: data.since };
  }
  const lockData = { pid: process.pid, since: new Date().toISOString(), name };
  fs.writeFileSync(lockPath, JSON.stringify(lockData, null, 2));
  return { acquired: true };
}

function releaseLock(name) {
  const lockPath = getLockPath(name);
  if (!fs.existsSync(lockPath)) return false;
  const data = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  if (data.pid !== process.pid) return false;
  fs.unlinkSync(lockPath);
  return true;
}

function isLocked(name) {
  return fs.existsSync(getLockPath(name));
}

function getLock(name) {
  const lockPath = getLockPath(name);
  if (!fs.existsSync(lockPath)) return null;
  return JSON.parse(fs.readFileSync(lockPath, 'utf8'));
}

function listLocks() {
  ensureLocksDir();
  return fs.readdirSync(LOCK_DIR)
    .filter(f => f.endsWith('.lock'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(LOCK_DIR, f), 'utf8'));
      return data;
    });
}

function forceRelease(name) {
  const lockPath = getLockPath(name);
  if (!fs.existsSync(lockPath)) return false;
  fs.unlinkSync(lockPath);
  return true;
}

module.exports = { ensureLocksDir, acquireLock, releaseLock, isLocked, getLock, listLocks, forceRelease };
