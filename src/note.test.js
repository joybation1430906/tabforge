const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('os', () => ({ homedir: () => '/tmp/tabforge-test-note' }));

const { addNote, removeNote, getNote, listNotes, loadNotes } = require('./note');

const NOTES_FILE = path.join('/tmp/tabforge-test-note', '.tabforge', 'notes.json');

beforeEach(() => {
  const dir = path.dirname(NOTES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(NOTES_FILE, JSON.stringify([]));
});

afterAll(() => {
  fs.rmSync('/tmp/tabforge-test-note', { recursive: true, force: true });
});

test('addNote adds a new note', () => {
  addNote('https://example.com', 'check this later');
  const notes = loadNotes();
  expect(notes).toHaveLength(1);
  expect(notes[0].url).toBe('https://example.com');
  expect(notes[0].text).toBe('check this later');
});

test('addNote updates existing note', () => {
  addNote('https://example.com', 'first');
  addNote('https://example.com', 'updated');
  const notes = loadNotes();
  expect(notes).toHaveLength(1);
  expect(notes[0].text).toBe('updated');
});

test('getNote returns correct note', () => {
  addNote('https://foo.com', 'foo note');
  const note = getNote('https://foo.com');
  expect(note).not.toBeNull();
  expect(note.text).toBe('foo note');
});

test('getNote returns null for missing url', () => {
  expect(getNote('https://missing.com')).toBeNull();
});

test('removeNote removes a note', () => {
  addNote('https://bar.com', 'bar note');
  removeNote('https://bar.com');
  expect(listNotes()).toHaveLength(0);
});

test('removeNote throws for unknown url', () => {
  expect(() => removeNote('https://nope.com')).toThrow();
});
