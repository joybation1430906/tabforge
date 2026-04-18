const { handleGroupCommand } = require('./group-commands');
const { loadGroup } = require('./group');
const { openTab } = require('./launcher');

function launchGroup(name, opts = {}) {
  const group = loadGroup(name);
  if (!group || !group.urls || group.urls.length === 0) {
    throw new Error(`Group '${name}' has no URLs.`);
  }
  const browser = opts.browser || null;
  group.urls.forEach(url => openTab(url, browser));
  console.log(`Launched ${group.urls.length} tab(s) from group '${name}'.`);
}

function handleGroupIntegration(args) {
  const [sub, ...rest] = args;
  if (sub === 'launch') {
    const name = rest[0];
    if (!name) throw new Error('Group name is required');
    launchGroup(name, { browser: rest[1] || null });
  } else {
    handleGroupCommand(args);
  }
}

module.exports = { launchGroup, handleGroupIntegration };
