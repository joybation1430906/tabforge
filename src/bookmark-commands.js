const { addBookmark, removeBookmark, findBookmarks, loadBookmarks } = require('./bookmark');

function cmdBookmarkAdd(args) {
  const [name, url, ...tags] = args;
  if (!name || !url) {
    console.error('Usage: tabforge bookmark add <name> <url> [tags...]');
    process.exit(1);
  }
  try {
    const b = addBookmark(name, url, tags);
    console.log(`Bookmark '${b.name}' added: ${b.url}`);
    if (b.tags.length) console.log(`Tags: ${b.tags.join(', ')}`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function cmdBookmarkRemove(args) {
  const [name] = args;
  if (!name) {
    console.error('Usage: tabforge bookmark remove <name>');
    process.exit(1);
  }
  try {
    removeBookmark(name);
    console.log(`Bookmark '${name}' removed`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function cmdBookmarkList(args) {
  const tag = args[0];
  const bookmarks = findBookmarks(tag);
  if (!bookmarks.length) {
    console.log(tag ? `No bookmarks with tag '${tag}'` : 'No bookmarks saved');
    return;
  }
  bookmarks.forEach(b => {
    const tags = b.tags.length ? ` [${b.tags.join(', ')}]` : '';
    console.log(`  ${b.name}: ${b.url}${tags}`);
  });
}

function handleBookmarkCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdBookmarkAdd(args);
    case 'remove': return cmdBookmarkRemove(args);
    case 'list': return cmdBookmarkList(args);
    default:
      console.error(`Unknown bookmark subcommand: ${sub}`);
      process.exit(1);
  }
}

module.exports = { cmdBookmarkAdd, cmdBookmarkRemove, cmdBookmarkList, handleBookmarkCommand };
