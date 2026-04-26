// dependency.js — track URL/session dependencies (e.g. session A requires session B to be open first)
const fs = require('fs');
const path = require('path');
const os = require('os');

const DEPS_DIR = path.join(os.homedir(), '.tabforge', 'dependencies');

function ensureDepsDir() {
  if (!fs.existsSync(DEPS_DIR)) {
    fs.mkdirSync(DEPS_DIR, { recursive: true });
  }
}

function getDepsPath(name) {
  return path.join(DEPS_DIR, `${name}.json`);
}

function loadDependencies(name) {
  ensureDepsDir();
  const p = getDepsPath(name);
  if (!fs.existsSync(p)) return { name, deps: [] };
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function saveDependencies(name, data) {
  ensureDepsDir();
  fs.writeFileSync(getDepsPath(name), JSON.stringify(data, null, 2));
}

/**
 * Add a dependency: `name` depends on `dep`
 */
function addDependency(name, dep) {
  if (name === dep) throw new Error('A session cannot depend on itself');
  const data = loadDependencies(name);
  if (!data.deps.includes(dep)) {
    data.deps.push(dep);
    saveDependencies(name, data);
  }
  return data;
}

function removeDependency(name, dep) {
  const data = loadDependencies(name);
  data.deps = data.deps.filter(d => d !== dep);
  saveDependencies(name, data);
  return data;
}

function listDependencies(name) {
  return loadDependencies(name).deps;
}

/**
 * Return all entries that declare `name` as a dependency (reverse lookup)
 */
function getDependents(name) {
  ensureDepsDir();
  const files = fs.readdirSync(DEPS_DIR).filter(f => f.endsWith('.json'));
  const dependents = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(DEPS_DIR, file), 'utf8'));
    if (data.deps && data.deps.includes(name)) {
      dependents.push(data.name);
    }
  }
  return dependents;
}

/**
 * Detect circular dependencies using DFS.
 * Returns true if adding `dep` to `name` would create a cycle.
 */
function wouldCreateCycle(name, dep) {
  const visited = new Set();
  function dfs(current) {
    if (current === name) return true;
    if (visited.has(current)) return false;
    visited.add(current);
    const { deps } = loadDependencies(current);
    return deps.some(d => dfs(d));
  }
  return dfs(dep);
}

function deleteDependencies(name) {
  ensureDepsDir();
  const p = getDepsPath(name);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}

module.exports = {
  ensureDepsDir,
  getDepsPath,
  loadDependencies,
  saveDependencies,
  addDependency,
  removeDependency,
  listDependencies,
  getDependents,
  wouldCreateCycle,
  deleteDependencies,
};
