const { addBadge, removeBadge, getBadge, listBadges } = require('./badge');

function cmdBadgeAdd(args) {
  const [name, url, label] = args;
  if (!name || !url) {
    console.error('Usage: tabforge badge add <name> <url> [label]');
    process.exit(1);
  }
  try {
    const badge = addBadge(name, url, label);
    console.log(`Badge '${badge.name}' added: ${badge.url}`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function cmdBadgeRemove(args) {
  const [name] = args;
  if (!name) {
    console.error('Usage: tabforge badge remove <name>');
    process.exit(1);
  }
  try {
    removeBadge(name);
    console.log(`Badge '${name}' removed.`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function cmdBadgeList() {
  const badges = listBadges();
  if (!badges.length) { console.log('No badges saved.'); return; }
  badges.forEach(b => console.log(`  ${b.name} [${b.label}] -> ${b.url}`));
}

function cmdBadgeShow(args) {
  const [name] = args;
  if (!name) {
    console.error('Usage: tabforge badge show <name>');
    process.exit(1);
  }
  try {
    const badge = getBadge(name);
    console.log(JSON.stringify(badge, null, 2));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function handleBadgeCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdBadgeAdd(args);
    case 'remove': return cmdBadgeRemove(args);
    case 'list': return cmdBadgeList();
    case 'show': return cmdBadgeShow(args);
    default:
      console.error(`Unknown badge subcommand: ${sub}`);
      process.exit(1);
  }
}

module.exports = { cmdBadgeAdd, cmdBadgeRemove, cmdBadgeList, cmdBadgeShow, handleBadgeCommand };
