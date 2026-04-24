const { setEnv, getEnv, removeEnv, listEnv } = require('./env');

function cmdEnvSet(args) {
  const [key, value] = args;
  if (!key || value === undefined) {
    console.error('Usage: tabforge env set <key> <value>');
    process.exit(1);
  }
  setEnv(key, value);
  console.log(`Set env var: ${key}=${value}`);
}

function cmdEnvGet(args) {
  const [key] = args;
  if (!key) {
    console.error('Usage: tabforge env get <key>');
    process.exit(1);
  }
  const value = getEnv(key);
  if (value === undefined) {
    console.log(`Env var "${key}" not found`);
  } else {
    console.log(`${key}=${value}`);
  }
}

function cmdEnvRemove(args) {
  const [key] = args;
  if (!key) {
    console.error('Usage: tabforge env remove <key>');
    process.exit(1);
  }
  const removed = removeEnv(key);
  if (removed) {
    console.log(`Removed env var: ${key}`);
  } else {
    console.log(`Env var "${key}" not found`);
  }
}

function cmdEnvList() {
  const env = listEnv();
  const keys = Object.keys(env);
  if (keys.length === 0) {
    console.log('No env vars set');
    return;
  }
  keys.forEach(k => console.log(`${k}=${env[k]}`));
}

function handleEnvCommand(sub, args) {
  switch (sub) {
    case 'set': return cmdEnvSet(args);
    case 'get': return cmdEnvGet(args);
    case 'remove': case 'rm': return cmdEnvRemove(args);
    case 'list': case 'ls': return cmdEnvList();
    default:
      console.error(`Unknown env subcommand: ${sub}`);
      process.exit(1);
  }
}

module.exports = { cmdEnvSet, cmdEnvGet, cmdEnvRemove, cmdEnvList, handleEnvCommand };
