const { savePlugin, loadPlugin, listPlugins, deletePlugin, enablePlugin, disablePlugin } = require('./plugin');

function cmdPluginAdd(args) {
  const [name, entry] = args;
  if (!name || !entry) return console.log('Usage: plugin add <name> <entry>');
  const plugin = { name, entry, enabled: true, addedAt: new Date().toISOString() };
  savePlugin(name, plugin);
  console.log(`Plugin '${name}' added.`);
}

function cmdPluginRemove(args) {
  const [name] = args;
  if (!name) return console.log('Usage: plugin remove <name>');
  if (deletePlugin(name)) console.log(`Plugin '${name}' removed.`);
  else console.log(`Plugin '${name}' not found.`);
}

function cmdPluginList() {
  const names = listPlugins();
  if (!names.length) return console.log('No plugins registered.');
  names.forEach(n => {
    const p = loadPlugin(n);
    console.log(`- ${n} [${p.enabled ? 'enabled' : 'disabled'}] (${p.entry})`);
  });
}

function cmdPluginShow(args) {
  const [name] = args;
  if (!name) return console.log('Usage: plugin show <name>');
  const p = loadPlugin(name);
  if (!p) return console.log(`Plugin '${name}' not found.`);
  console.log(JSON.stringify(p, null, 2));
}

function cmdPluginEnable(args) {
  const [name] = args;
  if (!name) return console.log('Usage: plugin enable <name>');
  if (enablePlugin(name)) console.log(`Plugin '${name}' enabled.`);
  else console.log(`Plugin '${name}' not found.`);
}

function cmdPluginDisable(args) {
  const [name] = args;
  if (!name) return console.log('Usage: plugin disable <name>');
  if (disablePlugin(name)) console.log(`Plugin '${name}' disabled.`);
  else console.log(`Plugin '${name}' not found.`);
}

function handlePluginCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdPluginAdd(args);
    case 'remove': return cmdPluginRemove(args);
    case 'list': return cmdPluginList();
    case 'show': return cmdPluginShow(args);
    case 'enable': return cmdPluginEnable(args);
    case 'disable': return cmdPluginDisable(args);
    default: console.log('Unknown plugin command. Use: add, remove, list, show, enable, disable');
  }
}

module.exports = { cmdPluginAdd, cmdPluginRemove, cmdPluginList, cmdPluginShow, cmdPluginEnable, cmdPluginDisable, handlePluginCommand };
