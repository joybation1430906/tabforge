const { addToWatchlist, removeFromWatchlist, getWatchlist, clearWatchlist } = require('./watchlist');

function cmdWatchlistAdd(args) {
  const [url, label] = args;
  if (!url) { console.log('Usage: tabforge watchlist add <url> [label]'); return; }
  try {
    const entry = addToWatchlist(url, label);
    console.log(`Added to watchlist: ${entry.label} (${entry.url})`);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

function cmdWatchlistRemove(args) {
  const [url] = args;
  if (!url) { console.log('Usage: tabforge watchlist remove <url>'); return; }
  try {
    removeFromWatchlist(url);
    console.log(`Removed from watchlist: ${url}`);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
}

function cmdWatchlistList() {
  const list = getWatchlist();
  if (!list.length) { console.log('Watchlist is empty.'); return; }
  list.forEach((e, i) => {
    const status = e.notified ? '[notified]' : '[pending]';
    console.log(`${i + 1}. ${e.label} — ${e.url} ${status}`);
  });
}

function cmdWatchlistClear() {
  clearWatchlist();
  console.log('Watchlist cleared.');
}

function handleWatchlistCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdWatchlistAdd(args);
    case 'remove': return cmdWatchlistRemove(args);
    case 'list': return cmdWatchlistList();
    case 'clear': return cmdWatchlistClear();
    default: console.log('Unknown watchlist subcommand. Use: add, remove, list, clear');
  }
}

module.exports = { cmdWatchlistAdd, cmdWatchlistRemove, cmdWatchlistList, cmdWatchlistClear, handleWatchlistCommand };
