const { getHistory, clearHistory, deleteHistoryEntry } = require('./history');

function cmdHistory(args) {
  const limit = parseInt(args['--limit'] || args['-n'] || '10', 10);
  const entries = getHistory(limit);
  if (entries.length === 0) {
    console.log('No launch history found.');
    return;
  }
  console.log(`Last ${entries.length} launches:\n`);
  entries.forEach(e => {
    const date = new Date(e.timestamp).toLocaleString();
    console.log(`  [${e.id}] ${date}`);
    console.log(`       config: ${e.configPath}`);
    console.log(`       tabs:   ${e.count} (${e.urls.slice(0, 3).join(', ')}${e.count > 3 ? '...' : ''})`);
    console.log();
  });
}

function cmdHistoryClear() {
  clearHistory();
  console.log('History cleared.');
}

function cmdHistoryDelete(args) {
  const id = parseInt(args._[0], 10);
  if (!id) {
    console.error('Usage: tabforge history delete <id>');
    process.exit(1);
  }
  const ok = deleteHistoryEntry(id);
  if (ok) {
    console.log(`Deleted history entry ${id}.`);
  } else {
    console.error(`No history entry with id ${id}.`);
    process.exit(1);
  }
}

module.exports = { cmdHistory, cmdHistoryClear, cmdHistoryDelete };
