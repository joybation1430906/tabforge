const { saveCollection, loadCollection, listCollections, deleteCollection, addUrlToCollection, removeUrlFromCollection } = require('./collection');

function cmdCollectionCreate(args) {
  const name = args[0];
  if (!name) return console.error('Usage: tabforge collection create <name>');
  const col = saveCollection(name, []);
  console.log(`Collection '${col.name}' created.`);
}

function cmdCollectionAdd(args) {
  const [name, url] = args;
  if (!name || !url) return console.error('Usage: tabforge collection add <name> <url>');
  const col = addUrlToCollection(name, url);
  console.log(`Added ${url} to '${name}' (${col.urls.length} urls).`);
}

function cmdCollectionRemove(args) {
  const [name, url] = args;
  if (!name || !url) return console.error('Usage: tabforge collection remove <name> <url>');
  const col = removeUrlFromCollection(name, url);
  if (!col) return console.error(`Collection '${name}' not found.`);
  console.log(`Removed ${url} from '${name}'.`);
}

function cmdCollectionList(args) {
  const cols = listCollections();
  if (!cols.length) return console.log('No collections found.');
  cols.forEach(c => console.log(`  - ${c}`));
}

function cmdCollectionShow(args) {
  const name = args[0];
  if (!name) return console.error('Usage: tabforge collection show <name>');
  const col = loadCollection(name);
  if (!col) return console.error(`Collection '${name}' not found.`);
  console.log(`Collection: ${col.name}`);
  col.urls.forEach((u, i) => console.log(`  ${i + 1}. ${u}`));
}

function cmdCollectionDelete(args) {
  const name = args[0];
  if (!name) return console.error('Usage: tabforge collection delete <name>');
  const ok = deleteCollection(name);
  if (!ok) return console.error(`Collection '${name}' not found.`);
  console.log(`Collection '${name}' deleted.`);
}

function handleCollectionCommand(sub, args) {
  switch (sub) {
    case 'create': return cmdCollectionCreate(args);
    case 'add': return cmdCollectionAdd(args);
    case 'remove': return cmdCollectionRemove(args);
    case 'list': return cmdCollectionList(args);
    case 'show': return cmdCollectionShow(args);
    case 'delete': return cmdCollectionDelete(args);
    default: console.error(`Unknown collection subcommand: ${sub}`);
  }
}

module.exports = { cmdCollectionCreate, cmdCollectionAdd, cmdCollectionRemove, cmdCollectionList, cmdCollectionShow, cmdCollectionDelete, handleCollectionCommand };
