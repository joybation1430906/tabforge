const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('os', () => ({ homedir: () => '/tmp/tabforge-tag-test-' + process.pid }));

const { addTag, removeTag, getTagsForSession, findSessionsByTag, clearTagsForSession, loadTags } = require('./tag');

const testHome = '/tmp/tabforge-tag-test-' + process.pid;

afterEach(() => {
  const tagsFile = path.join(testHome, '.tabforge', 'tags.json');
  if (fs.existsSync(tagsFile)) fs.writeFileSync(tagsFile, JSON.stringify({}));
});

afterAll(() => {
  fs.rmSync(testHome, { recursive: true, force: true });
});

test('addTag adds a tag to a session', () => {
  const result = addTag('work', 'important');
  expect(result).toContain('important');
});

test('addTag does not duplicate tags', () => {
  addTag('work', 'important');
  const result = addTag('work', 'important');
  expect(result.filter(t => t === 'important').length).toBe(1);
});

test('removeTag removes a tag from a session', () => {
  addTag('work', 'important');
  addTag('work', 'daily');
  const result = removeTag('work', 'important');
  expect(result).not.toContain('important');
  expect(result).toContain('daily');
});

test('getTagsForSession returns empty array for unknown session', () => {
  expect(getTagsForSession('nonexistent')).toEqual([]);
});

test('findSessionsByTag returns sessions with that tag', () => {
  addTag('work', 'dev');
  addTag('personal', 'dev');
  addTag('music', 'fun');
  const result = findSessionsByTag('dev');
  expect(result).toContain('work');
  expect(result).toContain('personal');
  expect(result).not.toContain('music');
});

test('clearTagsForSession removes all tags for session', () => {
  addTag('work', 'dev');
  clearTagsForSession('work');
  expect(getTagsForSession('work')).toEqual([]);
});
