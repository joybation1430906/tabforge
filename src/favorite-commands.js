const { addFavorite, removeFavorite, loadFavorites, getFavorite, searchFavorites } = require('./favorite');

function cmdFavoriteAdd(args) {
  const [name, url, ...tags] = args;
  if (!name || !url) {
    console.error('Usage: tabforge favorite add <name> <url> [tags...]');
    process.exit(1);
  }
  try {
    const fav = addFavorite(name, url, tags);
    console.log(`Favorite '${fav.name}' added: ${fav.url}`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function cmdFavoriteRemove(args) {
  const [name] = args;
  if (!name) { console.error('Usage: tabforge favorite remove <name>'); process.exit(1); }
  try {
    removeFavorite(name);
    console.log(`Favorite '${name}' removed.`);
  } catch (e) {
    console.error(e.message); process.exit(1);
  }
}

function cmdFavoriteList() {
  const favorites = loadFavorites();
  if (!favorites.length) { console.log('No favorites saved.'); return; }
  favorites.forEach(f => {
    const tags = f.tags.length ? ` [${f.tags.join(', ')}]` : '';
    console.log(`  ${f.name}: ${f.url}${tags}`);
  });
}

function cmdFavoriteShow(args) {
  const [name] = args;
  if (!name) { console.error('Usage: tabforge favorite show <name>'); process.exit(1); }
  try {
    const fav = getFavorite(name);
    console.log(JSON.stringify(fav, null, 2));
  } catch (e) {
    console.error(e.message); process.exit(1);
  }
}

function cmdFavoriteSearch(args) {
  const [query] = args;
  if (!query) { console.error('Usage: tabforge favorite search <query>'); process.exit(1); }
  const results = searchFavorites(query);
  if (!results.length) { console.log('No matches found.'); return; }
  results.forEach(f => console.log(`  ${f.name}: ${f.url}`));
}

function handleFavoriteCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdFavoriteAdd(args);
    case 'remove': return cmdFavoriteRemove(args);
    case 'list': return cmdFavoriteList();
    case 'show': return cmdFavoriteShow(args);
    case 'search': return cmdFavoriteSearch(args);
    default:
      console.error(`Unknown favorite subcommand: ${sub}`);
      process.exit(1);
  }
}

module.exports = { cmdFavoriteAdd, cmdFavoriteRemove, cmdFavoriteList, cmdFavoriteShow, cmdFavoriteSearch, handleFavoriteCommand };
