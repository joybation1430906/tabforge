const { addPin, removePin, loadPins, getPin, searchPins } = require('./pin');

function cmdPinAdd(args) {
  const [name, url, label = ''] = args;
  if (!name || !url) { console.error('Usage: tabforge pin add <name> <url> [label]'); process.exit(1); }
  try {
    const pin = addPin(name, url, label);
    console.log(`Pinned '${pin.name}' -> ${pin.url}`);
  } catch (e) { console.error(e.message); process.exit(1); }
}

function cmdPinRemove(args) {
  const [name] = args;
  if (!name) { console.error('Usage: tabforge pin remove <name>'); process.exit(1); }
  try {
    removePin(name);
    console.log(`Removed pin '${name}'`);
  } catch (e) { console.error(e.message); process.exit(1); }
}

function cmdPinList() {
  const pins = loadPins();
  if (!pins.length) { console.log('No pins saved.'); return; }
  pins.forEach(p => console.log(`  ${p.name}${p.label ? ' [' + p.label + ']' : ''}: ${p.url}`));
}

function cmdPinShow(args) {
  const [name] = args;
  if (!name) { console.error('Usage: tabforge pin show <name>'); process.exit(1); }
  try {
    const pin = getPin(name);
    console.log(JSON.stringify(pin, null, 2));
  } catch (e) { console.error(e.message); process.exit(1); }
}

function cmdPinSearch(args) {
  const [query] = args;
  if (!query) { console.error('Usage: tabforge pin search <query>'); process.exit(1); }
  const results = searchPins(query);
  if (!results.length) { console.log('No matching pins.'); return; }
  results.forEach(p => console.log(`  ${p.name}: ${p.url}`));
}

function cmdPinCount() {
  const pins = loadPins();
  console.log(`Total pins: ${pins.length}`);
}

function handlePinCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdPinAdd(args);
    case 'remove': return cmdPinRemove(args);
    case 'list': return cmdPinList();
    case 'show': return cmdPinShow(args);
    case 'search': return cmdPinSearch(args);
    case 'count': return cmdPinCount();
    default: console.error(`Unknown pin command: ${sub}`); process.exit(1);
  }
}

module.exports = { cmdPinAdd, cmdPinRemove, cmdPinList, cmdPinShow, cmdPinSearch, cmdPinCount, handlePinCommand };
