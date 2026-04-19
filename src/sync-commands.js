const { addRemote, removeRemote, listRemotes, getRemote } = require('./sync');

function cmdSyncAdd(args) {
  const [name, url] = args;
  if (!name || !url) return console.error('Usage: tabforge sync add <name> <url>');
  try {
    addRemote(name, url);
    console.log(`Remote '${name}' added: ${url}`);
  } catch (e) {
    console.error(e.message);
  }
}

function cmdSyncRemove(args) {
  const [name] = args;
  if (!name) return console.error('Usage: tabforge sync remove <name>');
  try {
    removeRemote(name);
    console.log(`Remote '${name}' removed`);
  } catch (e) {
    console.error(e.message);
  }
}

function cmdSyncList() {
  const remotes = listRemotes();
  if (!remotes.length) return console.log('No remotes configured.');
  remotes.forEach(r => console.log(`  ${r.name}  ${r.url}  (added: ${r.addedAt})`));
}

function cmdSyncShow(args) {
  const [name] = args;
  if (!name) return console.error('Usage: tabforge sync show <name>');
  try {
    const remote = getRemote(name);
    console.log(JSON.stringify(remote, null, 2));
  } catch (e) {
    console.error(e.message);
  }
}

function handleSyncCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdSyncAdd(args);
    case 'remove': return cmdSyncRemove(args);
    case 'list': return cmdSyncList();
    case 'show': return cmdSyncShow(args);
    default: console.error(`Unknown sync command: ${sub}`);
  }
}

module.exports = { cmdSyncAdd, cmdSyncRemove, cmdSyncList, cmdSyncShow, handleSyncCommand };
