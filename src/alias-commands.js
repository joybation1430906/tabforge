const { addAlias, removeAlias, listAliases, resolveAlias } = require('./alias');

function cmdAliasAdd(args) {
  const [name, target] = args;
  if (!name || !target) {
    console.error('Usage: tabforge alias add <name> <target>');
    process.exit(1);
  }
  try {
    addAlias(name, target);
    console.log(`Alias '${name}' -> '${target}' added.`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function cmdAliasRemove(args) {
  const [name] = args;
  if (!name) {
    console.error('Usage: tabforge alias remove <name>');
    process.exit(1);
  }
  try {
    removeAlias(name);
    console.log(`Alias '${name}' removed.`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function cmdAliasList() {
  const aliases = listAliases();
  const keys = Object.keys(aliases);
  if (keys.length === 0) {
    console.log('No aliases defined.');
    return;
  }
  keys.forEach(k => console.log(`  ${k} -> ${aliases[k].target}`));
}

function cmdAliasShow(args) {
  const [name] = args;
  if (!name) { console.error('Usage: tabforge alias show <name>'); process.exit(1); }
  const target = resolveAlias(name);
  if (!target) { console.error(`Alias '${name}' not found.`); process.exit(1); }
  console.log(`${name} -> ${target}`);
}

function handleAliasCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdAliasAdd(args);
    case 'remove': return cmdAliasRemove(args);
    case 'list': return cmdAliasList();
    case 'show': return cmdAliasShow(args);
    default:
      console.error(`Unknown alias subcommand: ${sub}`);
      process.exit(1);
  }
}

module.exports = { cmdAliasAdd, cmdAliasRemove, cmdAliasList, cmdAliasShow, handleAliasCommand };
