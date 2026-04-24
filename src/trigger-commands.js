const { addTrigger, removeTrigger, getTrigger, loadTriggers, toggleTrigger } = require('./trigger');

function cmdTriggerAdd(args) {
  const [name, event, target] = args;
  if (!name || !event || !target) {
    console.error('Usage: tabforge trigger add <name> <event> <target>');
    console.error('Events: launch, open, close, save');
    process.exit(1);
  }
  try {
    const trigger = addTrigger(name, event, target);
    console.log(`Trigger '${trigger.name}' added for event '${trigger.event}' -> '${trigger.target}'`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function cmdTriggerRemove(args) {
  const [name] = args;
  if (!name) { console.error('Usage: tabforge trigger remove <name>'); process.exit(1); }
  try {
    removeTrigger(name);
    console.log(`Trigger '${name}' removed`);
  } catch (e) {
    console.error(e.message); process.exit(1);
  }
}

function cmdTriggerList() {
  const triggers = loadTriggers();
  if (!triggers.length) { console.log('No triggers defined.'); return; }
  triggers.forEach(t => {
    const status = t.enabled ? '✓' : '✗';
    console.log(`[${status}] ${t.name}  event=${t.event}  target=${t.target}`);
  });
}

function cmdTriggerShow(args) {
  const [name] = args;
  if (!name) { console.error('Usage: tabforge trigger show <name>'); process.exit(1); }
  try {
    const t = getTrigger(name);
    console.log(JSON.stringify(t, null, 2));
  } catch (e) {
    console.error(e.message); process.exit(1);
  }
}

function cmdTriggerToggle(args) {
  const [name] = args;
  if (!name) { console.error('Usage: tabforge trigger toggle <name>'); process.exit(1); }
  try {
    const t = toggleTrigger(name);
    console.log(`Trigger '${name}' is now ${t.enabled ? 'enabled' : 'disabled'}`);
  } catch (e) {
    console.error(e.message); process.exit(1);
  }
}

function handleTriggerCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdTriggerAdd(args);
    case 'remove': return cmdTriggerRemove(args);
    case 'list': return cmdTriggerList();
    case 'show': return cmdTriggerShow(args);
    case 'toggle': return cmdTriggerToggle(args);
    default:
      console.error(`Unknown trigger subcommand: ${sub}`);
      process.exit(1);
  }
}

module.exports = { cmdTriggerAdd, cmdTriggerRemove, cmdTriggerList, cmdTriggerShow, cmdTriggerToggle, handleTriggerCommand };
