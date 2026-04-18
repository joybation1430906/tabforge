const { addTag, removeTag, listTags, getTagged, renameTag } = require('./tag');

async function cmdTagAdd(args) {
  if (args.length < 2) {
    console.error('Usage: tabforge tag add <session> <tag>');
    process.exit(1);
  }
  const [session, tag] = args;
  await addTag(session, tag);
  console.log(`Tagged "${session}" with "${tag}"`);
}

async function cmdTagRemove(args) {
  if (args.length < 2) {
    console.error('Usage: tabforge tag remove <session> <tag>');
    process.exit(1);
  }
  const [session, tag] = args;
  await removeTag(session, tag);
  console.log(`Removed tag "${tag}" from "${session}"`);
}

async function cmdTagList(args) {
  const tags = await listTags();
  if (Object.keys(tags).length === 0) {
    console.log('No tags found.');
    return;
  }
  for (const [tag, sessions] of Object.entries(tags)) {
    console.log(`${tag}: ${sessions.join(', ')}`);
  }
}

async function cmdTagSearch(args) {
  if (args.length < 1) {
    console.error('Usage: tabforge tag search <tag>');
    process.exit(1);
  }
  const [tag] = args;
  const sessions = await getTagged(tag);
  if (sessions.length === 0) {
    console.log(`No sessions tagged with "${tag}".`);
    return;
  }
  console.log(`Sessions tagged "${tag}":`);
  sessions.forEach(s => console.log(`  - ${s}`));
}

async function cmdTagRename(args) {
  if (args.length < 2) {
    console.error('Usage: tabforge tag rename <old> <new>');
    process.exit(1);
  }
  const [oldTag, newTag] = args;
  await renameTag(oldTag, newTag);
  console.log(`Renamed tag "${oldTag}" to "${newTag}"`);
}

async function handleTagCommand(sub, args) {
  switch (sub) {
    case 'add':    return cmdTagAdd(args);
    case 'remove': return cmdTagRemove(args);
    case 'list':   return cmdTagList(args);
    case 'search': return cmdTagSearch(args);
    case 'rename': return cmdTagRename(args);
    default:
      console.error(`Unknown tag subcommand: ${sub}`);
      process.exit(1);
  }
}

module.exports = { cmdTagAdd, cmdTagRemove, cmdTagList, cmdTagSearch, cmdTagRename, handleTagCommand };
