const { addToWatchlist, getWatchlist } = require('./watchlist');
const { openTab } = require('./launcher');

/**
 * Launch all URLs in the watchlist that have not yet been notified.
 * Marks each as notified after opening.
 */
function launchPendingWatchlist(browser) {
  const { markNotified } = require('./watchlist');
  const list = getWatchlist();
  const pending = list.filter(e => !e.notified);
  if (!pending.length) {
    console.log('No pending watchlist items.');
    return;
  }
  pending.forEach(entry => {
    try {
      openTab(entry.url, browser);
      markNotified(entry.url);
      console.log(`Opened and marked: ${entry.label}`);
    } catch (e) {
      console.log(`Failed to open ${entry.url}: ${e.message}`);
    }
  });
}

/**
 * Import URLs from a parsed session config into the watchlist.
 */
function importSessionToWatchlist(sessionConfig) {
  const tabs = sessionConfig.tabs || [];
  let added = 0;
  tabs.forEach(tab => {
    try {
      addToWatchlist(tab.url, tab.name || tab.url);
      added++;
    } catch (_) {
      // skip duplicates silently
    }
  });
  console.log(`Imported ${added} tab(s) into watchlist.`);
}

function handleWatchlistIntegration(action, payload, browser) {
  if (action === 'launch-pending') return launchPendingWatchlist(browser);
  if (action === 'import-session') return importSessionToWatchlist(payload);
}

module.exports = { launchPendingWatchlist, importSessionToWatchlist, handleWatchlistIntegration };
