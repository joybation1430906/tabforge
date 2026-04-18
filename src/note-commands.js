const { addNote, removeNote, getNote, listNotes } = require('./note');

function cmdNoteAdd(args) {
  const [url, ...rest] = args;
  if (!url || rest.length === 0) {
    console.error('Usage: tabforge note add <url> <text...>');
    process.exit(1);
  }
  const text = rest.join(' ');
  addNote(url, text);
  console.log(`Note saved for ${url}`);
}

function cmdNoteRemove(args) {
  const [url] = args;
  if (!url) {
    console.error('Usage: tabforge note remove <url>');
    process.exit(1);
  }
  try {
    removeNote(url);
    console.log(`Note removed for ${url}`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function cmdNoteShow(args) {
  const [url] = args;
  if (!url) {
    console.error('Usage: tabforge note show <url>');
    process.exit(1);
  }
  const note = getNote(url);
  if (!note) {
    console.log(`No note found for ${url}`);
  } else {
    console.log(`${note.url}: ${note.text}`);
  }
}

function cmdNoteList() {
  const notes = listNotes();
  if (notes.length === 0) {
    console.log('No notes saved.');
  } else {
    notes.forEach(n => console.log(`${n.url}: ${n.text}`));
  }
}

function handleNoteCommand(args) {
  const [sub, ...rest] = args;
  switch (sub) {
    case 'add': return cmdNoteAdd(rest);
    case 'remove': return cmdNoteRemove(rest);
    case 'show': return cmdNoteShow(rest);
    case 'list': return cmdNoteList();
    default:
      console.error(`Unknown note command: ${sub}`);
      process.exit(1);
  }
}

module.exports = { cmdNoteAdd, cmdNoteRemove, cmdNoteShow, cmdNoteList, handleNoteCommand };
