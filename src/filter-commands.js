const { filterBookmarks } = require('./filter');

function cmdFilter(args) {
  const opts = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--tag' && args[i + 1]) opts.tag = args[++i];
    else if (args[i] === '--search' && args[i + 1]) opts.search = args[++i];
    else if (args[i] === '--since' && args[i + 1]) opts.since = args[++i];
  }
  if (!opts.tag && !opts.search && !opts.since) {
    console.log('Usage: tabforge filter [--tag <tag>] [--search <query>] [--since <date>]');
    return;
  }
  const results = filterBookmarks(opts);
  if (!results.length) {
    console.log('No results found.');
    return;
  }
  results.forEach(b => {
    const tags = b.tags && b.tags.length ? ` [${b.tags.join(', ')}]` : '';
    console.log(`${b.name}${tags} — ${b.url}`);
  });
}

function handleFilterCommand(args) {
  cmdFilter(args);
}

module.exports = { cmdFilter, handleFilterCommand };
