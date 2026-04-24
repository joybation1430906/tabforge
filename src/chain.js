const fs = require('fs');
const path = require('path');
const os = require('os');

const CHAINS_DIR = path.join(os.homedir(), '.tabforge', 'chains');

function ensureChainsDir() {
  if (!fs.existsSync(CHAINS_DIR)) {
    fs.mkdirSync(CHAINS_DIR, { recursive: true });
  }
}

function getChainPath(name) {
  return path.join(CHAINS_DIR, `${name}.json`);
}

function saveChain(name, steps) {
  ensureChainsDir();
  const chain = { name, steps, createdAt: new Date().toISOString() };
  fs.writeFileSync(getChainPath(name), JSON.stringify(chain, null, 2));
  return chain;
}

function loadChain(name) {
  const chainPath = getChainPath(name);
  if (!fs.existsSync(chainPath)) return null;
  return JSON.parse(fs.readFileSync(chainPath, 'utf8'));
}

function listChains() {
  ensureChainsDir();
  return fs.readdirSync(CHAINS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteChain(name) {
  const chainPath = getChainPath(name);
  if (!fs.existsSync(chainPath)) return false;
  fs.unlinkSync(chainPath);
  return true;
}

function renameChain(oldName, newName) {
  const chain = loadChain(oldName);
  if (!chain) return false;
  chain.name = newName;
  fs.writeFileSync(getChainPath(newName), JSON.stringify(chain, null, 2));
  fs.unlinkSync(getChainPath(oldName));
  return true;
}

function appendStep(name, step) {
  const chain = loadChain(name);
  if (!chain) return null;
  chain.steps.push(step);
  fs.writeFileSync(getChainPath(name), JSON.stringify(chain, null, 2));
  return chain;
}

module.exports = {
  ensureChainsDir,
  saveChain,
  loadChain,
  listChains,
  deleteChain,
  renameChain,
  appendStep,
  CHAINS_DIR
};
