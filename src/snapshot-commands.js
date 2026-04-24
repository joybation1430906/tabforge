const { saveSnapshot, loadSnapshot, listSnapshots, deleteSnapshot, renameSnapshot } = require('./snapshot');

function cmdSnapshotSave(args) {
  const name = args[0];
  if (!name) { console.error('Usage: tabforge snapshot save <name> [--tabs url1,url2]'); process.exit(1); }
  const tabsArg = args.indexOf('--tabs');
  const tabs = tabsArg !== -1 ? args[tabsArg + 1].split(',').map(url => ({ url })) : [];
  const snapshot = saveSnapshot(name, { tabs });
  console.log(`Snapshot '${name}' saved with ${snapshot.tabs.length} tab(s).`);
}

function cmdSnapshotList() {
  const snapshots = listSnapshots();
  if (!snapshots.length) { console.log('No snapshots saved.'); return; }
  console.log('Snapshots:');
  snapshots.forEach(s => {
    console.log(`  ${s.name} — ${s.tabCount} tab(s) — ${s.createdAt}`);
  });
}

function cmdSnapshotShow(args) {
  const name = args[0];
  if (!name) { console.error('Usage: tabforge snapshot show <name>'); process.exit(1); }
  const snapshot = loadSnapshot(name);
  if (!snapshot) { console.error(`Snapshot '${name}' not found.`); process.exit(1); }
  console.log(`Snapshot: ${snapshot.name}`);
  console.log(`Created: ${snapshot.createdAt}`);
  console.log('Tabs:');
  (snapshot.tabs || []).forEach((t, i) => console.log(`  ${i + 1}. ${t.url}`));
}

function cmdSnapshotDelete(args) {
  const name = args[0];
  if (!name) { console.error('Usage: tabforge snapshot delete <name>'); process.exit(1); }
  const ok = deleteSnapshot(name);
  if (!ok) { console.error(`Snapshot '${name}' not found.`); process.exit(1); }
  console.log(`Snapshot '${name}' deleted.`);
}

function cmdSnapshotRename(args) {
  const [oldName, newName] = args;
  if (!oldName || !newName) { console.error('Usage: tabforge snapshot rename <old> <new>'); process.exit(1); }
  const ok = renameSnapshot(oldName, newName);
  if (!ok) { console.error(`Snapshot '${oldName}' not found.`); process.exit(1); }
  console.log(`Snapshot renamed from '${oldName}' to '${newName}'.`);
}

function handleSnapshotCommand(sub, args) {
  switch (sub) {
    case 'save': return cmdSnapshotSave(args);
    case 'list': return cmdSnapshotList();
    case 'show': return cmdSnapshotShow(args);
    case 'delete': return cmdSnapshotDelete(args);
    case 'rename': return cmdSnapshotRename(args);
    default:
      console.error(`Unknown snapshot subcommand: ${sub}`);
      process.exit(1);
  }
}

module.exports = { cmdSnapshotSave, cmdSnapshotList, cmdSnapshotShow, cmdSnapshotDelete, cmdSnapshotRename, handleSnapshotCommand };
