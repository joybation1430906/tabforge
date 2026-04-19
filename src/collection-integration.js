const { loadCollection } = require('./collection');
const { openTab } = require('./launcher');

async function launchCollection(name, browser) {
  const col = loadCollection(name);
  if (!col) {
    console.error(`Collection '${name}' not found.`);
    return false;
  }
  if (!col.urls.length) {
    console.log(`Collection '${name}' has no URLs.`);
    return false;
  }
  console.log(`Launching collection '${name}' (${col.urls.length} tabs)...`);
  for (const url of col.urls) {
    await openTab(url, browser);
  }
  return true;
}

function handleCollectionLaunch(args) {
  const name = args[0];
  const browser = args[1] || null;
  if (!name) return console.error('Usage: tabforge collection launch <name> [browser]');
  return launchCollection(name, browser);
}

module.exports = { launchCollection, handleCollectionLaunch };
