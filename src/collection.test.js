const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('os', () => ({ homedir: () => '/tmp/tabforge-test-collection' }));

const { saveCollection, loadCollection, listCollections, deleteCollection, addUrlToCollection, removeUrlFromCollection } = require('./collection');

beforeEach(() => {
  const dir = path.join('/tmp/tabforge-test-collection', '.tabforge', 'collections');
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
});

test('saveCollection and loadCollection', () => {
  saveCollection('work', ['https://github.com']);
  const col = loadCollection('work');
  expect(col.name).toBe('work');
  expect(col.urls).toContain('https://github.com');
});

test('loadCollection returns null for missing', () => {
  expect(loadCollection('nope')).toBeNull();
});

test('listCollections', () => {
  saveCollection('alpha', []);
  saveCollection('beta', []);
  const list = listCollections();
  expect(list).toContain('alpha');
  expect(list).toContain('beta');
});

test('deleteCollection', () => {
  saveCollection('temp', []);
  expect(deleteCollection('temp')).toBe(true);
  expect(loadCollection('temp')).toBeNull();
});

test('deleteCollection returns false for missing', () => {
  expect(deleteCollection('ghost')).toBe(false);
});

test('addUrlToCollection', () => {
  addUrlToCollection('news', 'https://news.ycombinator.com');
  const col = loadCollection('news');
  expect(col.urls).toContain('https://news.ycombinator.com');
});

test('addUrlToCollection no duplicates', () => {
  addUrlToCollection('news2', 'https://example.com');
  addUrlToCollection('news2', 'https://example.com');
  const col = loadCollection('news2');
  expect(col.urls.length).toBe(1);
});

test('removeUrlFromCollection', () => {
  saveCollection('rm', ['https://a.com', 'https://b.com']);
  const col = removeUrlFromCollection('rm', 'https://a.com');
  expect(col.urls).not.toContain('https://a.com');
  expect(col.urls).toContain('https://b.com');
});
