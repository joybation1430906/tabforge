const { saveLayout, loadLayout, listLayouts, deleteLayout, renameLayout } = require('./layout');

function cmdLayoutSave(args) {
  const [name, ...rest] = args;
  if (!name) return console.error('Usage: tabforge layout save <name> [--cols <n>] [--rows <n>]');
  const cols = parseInt(args[args.indexOf('--cols') + 1]) || 2;
  const rows = parseInt(args[args.indexOf('--rows') + 1]) || 1;
  const layout = { name, cols, rows, created: new Date().toISOString() };
  saveLayout(name, layout);
  console.log(`Layout '${name}' saved (${cols}x${rows})`);
}

function cmdLayoutList() {
  const layouts = listLayouts();
  if (!layouts.length) return console.log('No layouts saved.');
  layouts.forEach(name => {
    const l = loadLayout(name);
    console.log(`  ${name} — ${l.cols}x${l.rows}`);
  });
}

function cmdLayoutShow(args) {
  const [name] = args;
  if (!name) return console.error('Usage: tabforge layout show <name>');
  const layout = loadLayout(name);
  if (!layout) return console.error(`Layout '${name}' not found.`);
  console.log(JSON.stringify(layout, null, 2));
}

function cmdLayoutDelete(args) {
  const [name] = args;
  if (!name) return console.error('Usage: tabforge layout delete <name>');
  const ok = deleteLayout(name);
  console.log(ok ? `Layout '${name}' deleted.` : `Layout '${name}' not found.`);
}

function cmdLayoutRename(args) {
  const [oldName, newName] = args;
  if (!oldName || !newName) return console.error('Usage: tabforge layout rename <old> <new>');
  const ok = renameLayout(oldName, newName);
  console.log(ok ? `Renamed '${oldName}' to '${newName}'.` : `Layout '${oldName}' not found.`);
}

function handleLayoutCommand(sub, args) {
  switch (sub) {
    case 'save':   return cmdLayoutSave(args);
    case 'list':   return cmdLayoutList();
    case 'show':   return cmdLayoutShow(args);
    case 'delete': return cmdLayoutDelete(args);
    case 'rename': return cmdLayoutRename(args);
    default:
      console.error(`Unknown layout command: ${sub}`);
  }
}

module.exports = { cmdLayoutSave, cmdLayoutList, cmdLayoutShow, cmdLayoutDelete, cmdLayoutRename, handleLayoutCommand };
