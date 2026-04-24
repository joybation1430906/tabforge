const { addHook, loadHook, loadHooks, deleteHook, saveHook } = require('./hook');

function cmdHookAdd(args) {
  const [name, event, ...rest] = args;
  if (!name || !event || rest.length === 0) {
    console.log('Usage: tabforge hook add <name> <event> <command>');
    return;
  }
  const command = rest.join(' ');
  const hook = addHook(name, event, command);
  console.log(`Hook '${hook.name}' added for event '${hook.event}'.`);
}

function cmdHookRemove(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge hook remove <name>'); return; }
  const removed = deleteHook(name);
  console.log(removed ? `Hook '${name}' removed.` : `Hook '${name}' not found.`);
}

function cmdHookList() {
  const hooks = loadHooks();
  if (hooks.length === 0) { console.log('No hooks defined.'); return; }
  hooks.forEach(h => {
    const status = h.enabled ? 'enabled' : 'disabled';
    console.log(`  ${h.name} [${h.event}] (${status}): ${h.command}`);
  });
}

function cmdHookShow(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge hook show <name>'); return; }
  const hook = loadHook(name);
  if (!hook) { console.log(`Hook '${name}' not found.`); return; }
  console.log(JSON.stringify(hook, null, 2));
}

function cmdHookToggle(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge hook toggle <name>'); return; }
  const hook = loadHook(name);
  if (!hook) { console.log(`Hook '${name}' not found.`); return; }
  hook.enabled = !hook.enabled;
  saveHook(hook);
  console.log(`Hook '${name}' is now ${hook.enabled ? 'enabled' : 'disabled'}.`);
}

function handleHookCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdHookAdd(args);
    case 'remove': return cmdHookRemove(args);
    case 'list': return cmdHookList();
    case 'show': return cmdHookShow(args);
    case 'toggle': return cmdHookToggle(args);
    default:
      console.log('Unknown hook subcommand. Use: add, remove, list, show, toggle');
  }
}

module.exports = { cmdHookAdd, cmdHookRemove, cmdHookList, cmdHookShow, cmdHookToggle, handleHookCommand };
