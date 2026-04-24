const fs = require('fs');
const path = require('path');
const os = require('os');

const ENV_FILE = path.join(os.homedir(), '.tabforge', 'env.json');

function ensureEnvFile() {
  const dir = path.dirname(ENV_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(ENV_FILE)) fs.writeFileSync(ENV_FILE, JSON.stringify({}, null, 2));
}

function loadEnv() {
  ensureEnvFile();
  return JSON.parse(fs.readFileSync(ENV_FILE, 'utf8'));
}

function saveEnv(env) {
  ensureEnvFile();
  fs.writeFileSync(ENV_FILE, JSON.stringify(env, null, 2));
}

function setEnv(key, value) {
  const env = loadEnv();
  env[key] = value;
  saveEnv(env);
  return env;
}

function getEnv(key) {
  const env = loadEnv();
  return env[key];
}

function removeEnv(key) {
  const env = loadEnv();
  if (!(key in env)) return false;
  delete env[key];
  saveEnv(env);
  return true;
}

function listEnv() {
  return loadEnv();
}

function resolveEnvVars(str, extraEnv = {}) {
  const env = { ...loadEnv(), ...extraEnv };
  return str.replace(/\$\{([^}]+)\}/g, (_, key) => {
    return env[key] !== undefined ? env[key] : process.env[key] || `\${${key}}`;
  });
}

module.exports = {
  ensureEnvFile,
  loadEnv,
  saveEnv,
  setEnv,
  getEnv,
  removeEnv,
  listEnv,
  resolveEnvVars
};
