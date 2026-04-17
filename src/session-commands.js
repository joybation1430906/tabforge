const { saveSession, loadSession, listSessions, deleteSession } = require('./session');
const { openTab } = require('./launcher');

function cmdSave(name, tabs) {
  if (!name) throw new Error('Session name is required.');
  if (!Array.isArray(tabs) || tabs.length === 0) {
    throw new Error('No tabs provided to save.');
  }
  const filePath = saveSession(name, tabs);
  console.log(`Session "${name}" saved (${tabs.length} tab(s)) → ${filePath}`);
}

async function cmdRestore(name, browser) {
  const session = loadSession(name);
  console.log(`Restoring session "${name}" (${session.tabs.length} tab(s))...`);
  for (const url of session.tabs) {
    await openTab(url, browser);
  }
  console.log('Done.');
}

function cmdList() {
  const sessions = listSessions();
  if (sessions.length === 0) {
    console.log('No saved sessions found.');
    return;
  }
  console.log('Saved sessions:');
  sessions.forEach(s => console.log(`  - ${s}`));
}

function cmdDelete(name) {
  if (!name) throw new Error('Session name is required.');
  deleteSession(name);
  console.log(`Session "${name}" deleted.`);
}

function cmdShow(name) {
  const session = loadSession(name);
  console.log(`Session: ${session.name}`);
  console.log(`Saved at: ${session.savedAt}`);
  console.log(`Tabs (${session.tabs.length}):`);
  session.tabs.forEach((url, i) => console.log(`  ${i + 1}. ${url}`));
}

module.exports = { cmdSave, cmdRestore, cmdList, cmdDelete, cmdShow };
