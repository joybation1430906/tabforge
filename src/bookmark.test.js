const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('os', () => ({ homedir: () => '/tmp/tabforge-test-bookmark' }));

const { addBookmark, removeBookmark, findBookmarks, loadBookmarks } = require('./bookmark');

const TEST_DIR = '/tmp/tabforge-test-bookmark/.tabforge';

afterEach(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
});

test('addBookmark creates a bookmark', () => {
  const b = addBookmark('google', 'https://google.com', ['search']);
  expect(b.name).toBe('google');
  expect(b.url).toBe('https://google.com');
  expect(b.tags).toEqual(['search']);
  expect(b.createdAt).toBeDefined();
});

test('addBookmark throws on duplicate name', () => {
  addBookmark('dup', 'https://example.com');
  expect(() => addBookmark('dup', 'https://other.com')).toThrow("Bookmark 'dup' already exists");
});

test('removeBookmark removes existing bookmark', () => {
  addBookmark('temp', 'https://temp.com');
  removeBookmark('temp');
  const bookmarks = loadBookmarks();
  expect(bookmarks.find(b => b.name === 'temp')).toBeUndefined();
});

test('removeBookmark throws if not found', () => {
  expect(() => removeBookmark('ghost')).toThrow("Bookmark 'ghost' not found");
});

test('findBookmarks filters by tag', () => {
  addBookmark('a', 'https://a.com', ['work']);
  addBookmark('b', 'https://b.com', ['personal']);
  const results = findBookmarks('work');
  expect(results).toHaveLength(1);
  expect(results[0].name).toBe('a');
});

test('findBookmarks returns all when no tag given', () => {
  addBookmark('x', 'https://x.com');
  addBookmark('y', 'https://y.com');
  expect(findBookmarks()).toHaveLength(2);
});
