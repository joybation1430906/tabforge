const fs = require('fs');
const path = require('path');
const os = require('os');

const HOOKS_DIR = path.join(os.homedir(), '.tabforge', 'hooks');

function ensureHooksDir() {
  if (!fs.existsSync(HOOKS_DIR)) {
    fs.mkdirSync(HOOKS_DIR, { recursive: true });
  }
  return HOOKS_DIR;
}

function getHookPath(name) {
  return path.join(HOOKS_DIR, `${name}.json`);
}

function loadHooks() {
  ensureHooksDir();
  const files = fs.readdirSync(HOOKS_DIR).filter(f => f.endsWith('.json'));
  return files.map(f => {
    const raw = fs.readFileSync(path.join(HOOKS_DIR, f), 'utf8');
    return JSON.parse(raw);
  });
}

function saveHook(hook) {
  ensureHooksDir();
  fs.writeFileSync(getHookPath(hook.name), JSON.stringify(hook, null, 2));
}

function loadHook(name) {
  const p = getHookPath(name);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function deleteHook(name) {
  const p = getHookPath(name);
  if (!fs.existsSync(p)) return false;
  fs.unlinkSync(p);
  return true;
}

function addHook(name, event, command, opts = {}) {
  const hook = {
    name,
    event,
    command,
    enabled: opts.enabled !== false,
    createdAt: new Date().toISOString()
  };
  saveHook(hook);
  return hook;
}

function getHooksByEvent(event) {
  return loadHooks().filter(h => h.event === event && h.enabled);
}

module.exports = {
  ensureHooksDir,
  getHookPath,
  saveHook,
  loadHook,
  loadHooks,
  deleteHook,
  addHook,
  getHooksByEvent
};
