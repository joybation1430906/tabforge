const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('os', () => ({ homedir: () => '/tmp/tabforge-test-group' }));

const { saveGroup, loadGroup, listGroups, deleteGroup, addUrlToGroup } = require('./group');

beforeEach(() => {
  const dir = path.join('/tmp/tabforge-test-group', '.tabforge', 'groups');
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
});

test('saveGroup creates a group file', () => {
  const group = saveGroup('work', ['https://github.com', 'https://jira.com']);
  expect(group.name).toBe('work');
  expect(group.urls).toHaveLength(2);
});

test('loadGroup returns null for missing group', () => {
  expect(loadGroup('nonexistent')).toBeNull();
});

test('loadGroup returns saved group', () => {
  saveGroup('research', ['https://wikipedia.org']);
  const group = loadGroup('research');
  expect(group.name).toBe('research');
  expect(group.urls).toContain('https://wikipedia.org');
});

test('listGroups returns all groups', () => {
  saveGroup('work', ['https://github.com']);
  saveGroup('personal', ['https://reddit.com']);
  const groups = listGroups();
  expect(groups).toHaveLength(2);
  expect(groups.map(g => g.name)).toContain('work');
});

test('deleteGroup removes the group', () => {
  saveGroup('temp', ['https://example.com']);
  expect(deleteGroup('temp')).toBe(true);
  expect(loadGroup('temp')).toBeNull();
});

test('deleteGroup returns false for missing group', () => {
  expect(deleteGroup('ghost')).toBe(false);
});

test('addUrlToGroup appends url', () => {
  saveGroup('dev', ['https://github.com']);
  addUrlToGroup('dev', 'https://stackoverflow.com');
  const group = loadGroup('dev');
  expect(group.urls).toContain('https://stackoverflow.com');
});

test('addUrlToGroup throws for missing group', () => {
  expect(() => addUrlToGroup('missing', 'https://x.com')).toThrow("Group 'missing' not found");
});
