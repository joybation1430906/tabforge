const { addSnippet, removeSnippet, getSnippet, listSnippets } = require('./snippet');

function cmdSnippetAdd(args) {
  const name = args[0];
  const urls = args.slice(1);
  if (!name || urls.length === 0) {
    console.error('Usage: tabforge snippet add <name> <url> [url...]');
    process.exit(1);
  }
  const snippet = addSnippet(name, urls);
  console.log(`Snippet '${snippet.name}' saved with ${snippet.urls.length} URL(s).`);
}

function cmdSnippetRemove(args) {
  const name = args[0];
  if (!name) {
    console.error('Usage: tabforge snippet remove <name>');
    process.exit(1);
  }
  removeSnippet(name);
  console.log(`Snippet '${name}' removed.`);
}

function cmdSnippetList() {
  const snippets = listSnippets();
  if (snippets.length === 0) {
    console.log('No snippets saved.');
    return;
  }
  snippets.forEach(s => {
    console.log(`  ${s.name} (${s.urls.length} URL(s)) — ${s.createdAt}`);
    s.urls.forEach(u => console.log(`    - ${u}`));
  });
}

function cmdSnippetShow(args) {
  const name = args[0];
  if (!name) {
    console.error('Usage: tabforge snippet show <name>');
    process.exit(1);
  }
  const snippet = getSnippet(name);
  console.log(`Name: ${snippet.name}`);
  console.log(`Created: ${snippet.createdAt}`);
  console.log('URLs:');
  snippet.urls.forEach(u => console.log(`  - ${u}`));
}

function handleSnippetCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdSnippetAdd(args);
    case 'remove': return cmdSnippetRemove(args);
    case 'list': return cmdSnippetList();
    case 'show': return cmdSnippetShow(args);
    default:
      console.error(`Unknown snippet command: ${sub}`);
      process.exit(1);
  }
}

module.exports = { cmdSnippetAdd, cmdSnippetRemove, cmdSnippetList, cmdSnippetShow, handleSnippetCommand };
