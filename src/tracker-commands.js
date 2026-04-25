const { trackUrl, getTracked, listTracked, removeTracked, clearTracker, topTracked } = require('./tracker');

function cmdTrackerAdd(args) {
  const url = args[0];
  if (!url) return console.log('Usage: tabforge tracker add <url> [label]');
  const label = args[1] || '';
  const entry = trackUrl(url, label ? { label } : {});
  console.log(`Tracked: ${url} (visits: ${entry.visits})`);
}

function cmdTrackerShow(args) {
  const url = args[0];
  if (!url) return console.log('Usage: tabforge tracker show <url>');
  const entry = getTracked(url);
  if (!entry) return console.log(`Not tracked: ${url}`);
  console.log(JSON.stringify(entry, null, 2));
}

function cmdTrackerList() {
  const entries = listTracked();
  if (!entries.length) return console.log('No tracked URLs.');
  entries.forEach(e => {
    const label = e.label ? ` [${e.label}]` : '';
    console.log(`${e.url}${label} — visits: ${e.visits}, last: ${e.lastSeen}`);
  });
}

function cmdTrackerRemove(args) {
  const url = args[0];
  if (!url) return console.log('Usage: tabforge tracker remove <url>');
  const removed = removeTracked(url);
  console.log(removed ? `Removed: ${url}` : `Not found: ${url}`);
}

function cmdTrackerClear() {
  clearTracker();
  console.log('Tracker cleared.');
}

function cmdTrackerTop(args) {
  const limit = parseInt(args[0], 10) || 10;
  const entries = topTracked(limit);
  if (!entries.length) return console.log('No tracked URLs.');
  entries.forEach((e, i) => {
    const label = e.label ? ` [${e.label}]` : '';
    console.log(`${i + 1}. ${e.url}${label} — ${e.visits} visits`);
  });
}

function handleTrackerCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdTrackerAdd(args);
    case 'show': return cmdTrackerShow(args);
    case 'list': return cmdTrackerList();
    case 'remove': return cmdTrackerRemove(args);
    case 'clear': return cmdTrackerClear();
    case 'top': return cmdTrackerTop(args);
    default: console.log('Unknown tracker subcommand. Use: add, show, list, remove, clear, top');
  }
}

module.exports = {
  cmdTrackerAdd,
  cmdTrackerShow,
  cmdTrackerList,
  cmdTrackerRemove,
  cmdTrackerClear,
  cmdTrackerTop,
  handleTrackerCommand
};
