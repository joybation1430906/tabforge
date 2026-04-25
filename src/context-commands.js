const { saveContext, loadContext, listContexts, deleteContext, renameContext } = require('./context');

function cmdContextSave(args) {
  const [name, ...rest] = args;
  if (!name) return console.log('Usage: tabforge context save <name> [description]');
  const description = rest.join(' ') || '';
  const data = { name, description, createdAt: new Date().toISOString() };
  saveContext(name, data);
  console.log(`Context '${name}' saved.`);
}

function cmdContextList() {
  const names = listContexts();
  if (!names.length) return console.log('No contexts saved.');
  names.forEach(n => console.log(`  - ${n}`));
}

function cmdContextShow(args) {
  const [name] = args;
  if (!name) return console.log('Usage: tabforge context show <name>');
  const ctx = loadContext(name);
  if (!ctx) return console.log(`Context '${name}' not found.`);
  console.log(JSON.stringify(ctx, null, 2));
}

function cmdContextDelete(args) {
  const [name] = args;
  if (!name) return console.log('Usage: tabforge context delete <name>');
  const ok = deleteContext(name);
  console.log(ok ? `Context '${name}' deleted.` : `Context '${name}' not found.`);
}

function cmdContextRename(args) {
  const [oldName, newName] = args;
  if (!oldName || !newName) return console.log('Usage: tabforge context rename <old> <new>');
  const ok = renameContext(oldName, newName);
  console.log(ok ? `Renamed '${oldName}' to '${newName}'.` : `Context '${oldName}' not found.`);
}

function handleContextCommand(sub, args) {
  switch (sub) {
    case 'save':   return cmdContextSave(args);
    case 'list':   return cmdContextList();
    case 'show':   return cmdContextShow(args);
    case 'delete': return cmdContextDelete(args);
    case 'rename': return cmdContextRename(args);
    default: console.log('Unknown context subcommand: ' + sub);
  }
}

module.exports = {
  cmdContextSave,
  cmdContextList,
  cmdContextShow,
  cmdContextDelete,
  cmdContextRename,
  handleContextCommand,
};
