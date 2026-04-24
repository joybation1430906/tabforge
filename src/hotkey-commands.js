const { addHotkey, removeHotkey, listHotkeys, getHotkey } = require('./hotkey');

function cmdHotkeyAdd(args) {
  const [key, target, type] = args;
  if (!key || !target) {
    console.error('Usage: tabforge hotkey add <key> <target> [type]');
    process.exit(1);
  }
  try {
    const hotkey = addHotkey(key, target, type || 'session');
    console.log(`Hotkey '${hotkey.key}' -> '${hotkey.target}' (${hotkey.type}) added.`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function cmdHotkeyRemove(args) {
  const [key] = args;
  if (!key) {
    console.error('Usage: tabforge hotkey remove <key>');
    process.exit(1);
  }
  try {
    removeHotkey(key);
    console.log(`Hotkey '${key}' removed.`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function cmdHotkeyList() {
  const hotkeys = listHotkeys();
  if (!hotkeys.length) {
    console.log('No hotkeys defined.');
    return;
  }
  hotkeys.forEach(h => console.log(`  ${h.key.padEnd(20)} -> ${h.target} [${h.type}]`));
}

function cmdHotkeyShow(args) {
  const [key] = args;
  if (!key) {
    console.error('Usage: tabforge hotkey show <key>');
    process.exit(1);
  }
  const hotkey = getHotkey(key);
  if (!hotkey) {
    console.error(`Hotkey '${key}' not found.`);
    process.exit(1);
  }
  console.log(JSON.stringify(hotkey, null, 2));
}

function handleHotkeyCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdHotkeyAdd(args);
    case 'remove': return cmdHotkeyRemove(args);
    case 'list': return cmdHotkeyList();
    case 'show': return cmdHotkeyShow(args);
    default:
      console.error(`Unknown hotkey subcommand: ${sub}`);
      process.exit(1);
  }
}

module.exports = { cmdHotkeyAdd, cmdHotkeyRemove, cmdHotkeyList, cmdHotkeyShow, handleHotkeyCommand };
