const { getHotkey } = require('./hotkey');
const { loadSession } = require('./session');
const { openTab } = require('./launcher');

async function resolveHotkey(key) {
  const hotkey = getHotkey(key);
  if (!hotkey) throw new Error(`No hotkey registered for '${key}'`);
  return hotkey;
}

async function launchHotkey(key) {
  const hotkey = await resolveHotkey(key);
  if (hotkey.type === 'session') {
    const session = loadSession(hotkey.target);
    if (!session || !session.tabs) throw new Error(`Session '${hotkey.target}' is empty or invalid`);
    for (const tab of session.tabs) {
      await openTab(tab.url, tab.browser || session.browser);
    }
    console.log(`Launched session '${hotkey.target}' via hotkey '${key}'.`);
  } else if (hotkey.type === 'url') {
    await openTab(hotkey.target);
    console.log(`Opened '${hotkey.target}' via hotkey '${key}'.`);
  } else {
    throw new Error(`Unsupported hotkey type: ${hotkey.type}`);
  }
}

function handleHotkeyIntegration(args) {
  const [key] = args;
  if (!key) {
    console.error('Usage: tabforge hotkey launch <key>');
    process.exit(1);
  }
  launchHotkey(key).catch(e => {
    console.error(e.message);
    process.exit(1);
  });
}

module.exports = { resolveHotkey, launchHotkey, handleHotkeyIntegration };
