const { saveIntent, loadIntent, listIntents, deleteIntent, renameIntent } = require('./intent');

function cmdIntentSave(args) {
  const [name, ...urlParts] = args;
  if (!name || urlParts.length === 0) {
    console.log('Usage: tabforge intent save <name> <url> [description]');
    return;
  }
  const url = urlParts[0];
  const description = urlParts.slice(1).join(' ') || '';
  const intent = { name, url, description, createdAt: new Date().toISOString() };
  saveIntent(name, intent);
  console.log(`Intent '${name}' saved.`);
}

function cmdIntentList() {
  const intents = listIntents();
  if (intents.length === 0) {
    console.log('No intents saved.');
    return;
  }
  intents.forEach(name => {
    const intent = loadIntent(name);
    const desc = intent && intent.description ? ` — ${intent.description}` : '';
    const url = intent ? ` (${intent.url})` : '';
    console.log(`  ${name}${url}${desc}`);
  });
}

function cmdIntentShow(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge intent show <name>'); return; }
  const intent = loadIntent(name);
  if (!intent) { console.log(`Intent '${name}' not found.`); return; }
  console.log(JSON.stringify(intent, null, 2));
}

function cmdIntentDelete(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge intent delete <name>'); return; }
  const ok = deleteIntent(name);
  console.log(ok ? `Intent '${name}' deleted.` : `Intent '${name}' not found.`);
}

function cmdIntentRename(args) {
  const [oldName, newName] = args;
  if (!oldName || !newName) { console.log('Usage: tabforge intent rename <old> <new>'); return; }
  const ok = renameIntent(oldName, newName);
  console.log(ok ? `Intent renamed to '${newName}'.` : `Intent '${oldName}' not found.`);
}

function handleIntentCommand(sub, args) {
  switch (sub) {
    case 'save': return cmdIntentSave(args);
    case 'list': return cmdIntentList();
    case 'show': return cmdIntentShow(args);
    case 'delete': return cmdIntentDelete(args);
    case 'rename': return cmdIntentRename(args);
    default: console.log(`Unknown intent subcommand: ${sub}`);
  }
}

module.exports = {
  cmdIntentSave,
  cmdIntentList,
  cmdIntentShow,
  cmdIntentDelete,
  cmdIntentRename,
  handleIntentCommand,
};
