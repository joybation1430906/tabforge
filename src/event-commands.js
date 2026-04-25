const { saveEvent, loadEvent, listEvents, deleteEvent, renameEvent } = require('./event');

function cmdEventCreate(args) {
  const [name, ...rest] = args;
  if (!name) { console.log('Usage: tabforge event create <name> [--url <url>] [--session <session>]'); return; }
  const urlIdx = rest.indexOf('--url');
  const sessionIdx = rest.indexOf('--session');
  const event = {
    name,
    url: urlIdx !== -1 ? rest[urlIdx + 1] : null,
    session: sessionIdx !== -1 ? rest[sessionIdx + 1] : null,
    createdAt: new Date().toISOString()
  };
  saveEvent(name, event);
  console.log(`Event '${name}' created.`);
}

function cmdEventList() {
  const events = listEvents();
  if (!events.length) { console.log('No events found.'); return; }
  events.forEach(e => console.log(`  - ${e}`));
}

function cmdEventShow(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge event show <name>'); return; }
  const event = loadEvent(name);
  if (!event) { console.log(`Event '${name}' not found.`); return; }
  console.log(JSON.stringify(event, null, 2));
}

function cmdEventDelete(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge event delete <name>'); return; }
  const ok = deleteEvent(name);
  console.log(ok ? `Event '${name}' deleted.` : `Event '${name}' not found.`);
}

function cmdEventRename(args) {
  const [oldName, newName] = args;
  if (!oldName || !newName) { console.log('Usage: tabforge event rename <old> <new>'); return; }
  const ok = renameEvent(oldName, newName);
  console.log(ok ? `Event renamed to '${newName}'.` : `Event '${oldName}' not found.`);
}

function handleEventCommand(sub, args) {
  switch (sub) {
    case 'create': return cmdEventCreate(args);
    case 'list': return cmdEventList();
    case 'show': return cmdEventShow(args);
    case 'delete': return cmdEventDelete(args);
    case 'rename': return cmdEventRename(args);
    default: console.log(`Unknown event subcommand: ${sub}`);
  }
}

module.exports = { cmdEventCreate, cmdEventList, cmdEventShow, cmdEventDelete, cmdEventRename, handleEventCommand };
