const { setStatus, getStatus, removeStatus, listStatus, clearStatus } = require('./status');

function cmdStatusSet(args) {
  const [key, value] = args;
  if (!key || value === undefined) {
    console.log('Usage: tabforge status set <key> <value>');
    return;
  }
  const entry = setStatus(key, value);
  console.log(`Status set: ${key} = ${entry.value} (${entry.updatedAt})`);
}

function cmdStatusGet(args) {
  const [key] = args;
  if (!key) {
    console.log('Usage: tabforge status get <key>');
    return;
  }
  const entry = getStatus(key);
  if (!entry) {
    console.log(`No status found for key: ${key}`);
    return;
  }
  console.log(`${key}: ${entry.value} (updated: ${entry.updatedAt})`);
}

function cmdStatusRemove(args) {
  const [key] = args;
  if (!key) {
    console.log('Usage: tabforge status remove <key>');
    return;
  }
  const removed = removeStatus(key);
  console.log(removed ? `Removed status: ${key}` : `Key not found: ${key}`);
}

function cmdStatusList() {
  const data = listStatus();
  const keys = Object.keys(data);
  if (keys.length === 0) {
    console.log('No status entries.');
    return;
  }
  keys.forEach(k => console.log(`${k}: ${data[k].value} (${data[k].updatedAt})`));
}

function cmdStatusClear() {
  clearStatus();
  console.log('All status entries cleared.');
}

function handleStatusCommand(sub, args) {
  switch (sub) {
    case 'set': return cmdStatusSet(args);
    case 'get': return cmdStatusGet(args);
    case 'remove': return cmdStatusRemove(args);
    case 'list': return cmdStatusList();
    case 'clear': return cmdStatusClear();
    default: console.log(`Unknown status subcommand: ${sub}`);
  }
}

module.exports = { cmdStatusSet, cmdStatusGet, cmdStatusRemove, cmdStatusList, cmdStatusClear, handleStatusCommand };
