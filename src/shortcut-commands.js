const { addShortcut, removeShortcut, getShortcut, listShortcuts } = require('./shortcut');

function cmdShortcutAdd(args) {
  const [key, target, ...rest] = args;
  if (!key || !target) {
    console.error('Usage: tabforge shortcut add <key> <target> [description]');
    process.exit(1);
  }
  const description = rest.join(' ');
  try {
    addShortcut(key, target, description);
    console.log(`Shortcut '${key}' -> '${target}' added.`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function cmdShortcutRemove(args) {
  const [key] = args;
  if (!key) { console.error('Usage: tabforge shortcut remove <key>'); process.exit(1); }
  try {
    removeShortcut(key);
    console.log(`Shortcut '${key}' removed.`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function cmdShortcutList() {
  const shortcuts = listShortcuts();
  const keys = Object.keys(shortcuts);
  if (!keys.length) { console.log('No shortcuts saved.'); return; }
  keys.forEach(k => {
    const { target, description } = shortcuts[k];
    console.log(`  ${k} -> ${target}${description ? '  # ' + description : ''}`);
  });
}

function cmdShortcutShow(args) {
  const [key] = args;
  if (!key) { console.error('Usage: tabforge shortcut show <key>'); process.exit(1); }
  const s = getShortcut(key);
  if (!s) { console.error(`Shortcut '${key}' not found.`); process.exit(1); }
  console.log(JSON.stringify(s, null, 2));
}

function handleShortcutCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdShortcutAdd(args);
    case 'remove': return cmdShortcutRemove(args);
    case 'list': return cmdShortcutList();
    case 'show': return cmdShortcutShow(args);
    default:
      console.error(`Unknown shortcut command: ${sub}`);
      process.exit(1);
  }
}

module.exports = { cmdShortcutAdd, cmdShortcutRemove, cmdShortcutList, cmdShortcutShow, handleShortcutCommand };
