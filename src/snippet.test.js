const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('os', () => ({ homedir: () => '/tmp/tabforge-test-snippet' }));

const { addSnippet, removeSnippet, getSnippet, listSnippets, loadSnippets } = require('./snippet');

const TEST_DIR = '/tmp/tabforge-test-snippet/.tabforge';

beforeEach(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
});

test('addSnippet saves a new snippet', () => {
  const s = addSnippet('work', ['https://github.com', 'https://jira.example.com']);
  expect(s.name).toBe('work');
  expect(s.urls).toHaveLength(2);
  expect(s.createdAt).toBeDefined();
});

test('addSnippet throws on duplicate name', () => {
  addSnippet('dup', ['https://example.com']);
  expect(() => addSnippet('dup', ['https://other.com'])).toThrow("Snippet 'dup' already exists");
});

test('listSnippets returns all snippets', () => {
  addSnippet('a', ['https://a.com']);
  addSnippet('b', ['https://b.com']);
  expect(listSnippets()).toHaveLength(2);
});

test('getSnippet returns correct snippet', () => {
  addSnippet('mysnip', ['https://foo.com']);
  const s = getSnippet('mysnip');
  expect(s.name).toBe('mysnip');
});

test('getSnippet throws if not found', () => {
  expect(() => getSnippet('nope')).toThrow("Snippet 'nope' not found");
});

test('removeSnippet deletes snippet', () => {
  addSnippet('todel', ['https://del.com']);
  removeSnippet('todel');
  expect(listSnippets()).toHaveLength(0);
});

test('removeSnippet throws if not found', () => {
  expect(() => removeSnippet('ghost')).toThrow("Snippet 'ghost' not found");
});
