const fs = require('fs');
const path = require('path');
const os = require('os');

let mod;
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-rating-'));
const ratingsFile = path.join(tmpDir, 'ratings.json');

beforeEach(() => {
  jest.resetModules();
  jest.doMock('os', () => ({ homedir: () => tmpDir }));
  if (fs.existsSync(ratingsFile)) fs.unlinkSync(ratingsFile);
  mod = require('./rating');
});

test('ensureRatingsFile creates file', () => {
  mod.ensureRatingsFile();
  expect(fs.existsSync(ratingsFile)).toBe(true);
});

test('addRating stores entry', () => {
  const entry = mod.addRating('work', 4, 'productive');
  expect(entry.name).toBe('work');
  expect(entry.score).toBe(4);
  expect(entry.note).toBe('productive');
});

test('addRating rejects invalid score', () => {
  expect(() => mod.addRating('bad', 6)).toThrow('Rating must be between 1 and 5');
});

test('addRating updates existing entry', () => {
  mod.addRating('work', 3);
  mod.addRating('work', 5, 'updated');
  const ratings = mod.loadRatings();
  expect(ratings.filter(r => r.name === 'work').length).toBe(1);
  expect(ratings.find(r => r.name === 'work').score).toBe(5);
});

test('getRating returns correct entry', () => {
  mod.addRating('dev', 5);
  const entry = mod.getRating('dev');
  expect(entry).not.toBeNull();
  expect(entry.score).toBe(5);
});

test('getRating returns null for unknown', () => {
  expect(mod.getRating('nope')).toBeNull();
});

test('removeRating deletes entry', () => {
  mod.addRating('temp', 2);
  mod.removeRating('temp');
  expect(mod.getRating('temp')).toBeNull();
});

test('removeRating throws if not found', () => {
  expect(() => mod.removeRating('ghost')).toThrow('Rating not found: ghost');
});

test('topRated returns sorted by score', () => {
  mod.addRating('a', 2);
  mod.addRating('b', 5);
  mod.addRating('c', 3);
  const top = mod.topRated(2);
  expect(top[0].name).toBe('b');
  expect(top[1].name).toBe('c');
});
