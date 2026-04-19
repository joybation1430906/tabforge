const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('os', () => ({ homedir: () => '/tmp/tabforge-test-fav' }));

const { addFavorite, removeFavorite, loadFavorites, getFavorite, searchFavorites } = require('./favorite');

const FAVORITES_FILE = path.join('/tmp/tabforge-test-fav', '.tabforge', 'favorites.json');

beforeEach(() => {
  fs.rmSync(path.dirname(FAVORITES_FILE), { recursive: true, force: true });
});

test('addFavorite adds an entry', () => {
  const fav = addFavorite('gh', 'https://github.com', ['dev']);
  expect(fav.name).toBe('gh');
  expect(fav.url).toBe('https://github.com');
  expect(fav.tags).toContain('dev');
});

test('addFavorite throws on duplicate', () => {
  addFavorite('gh', 'https://github.com');
  expect(() => addFavorite('gh', 'https://github.com')).toThrow("Favorite 'gh' already exists");
});

test('loadFavorites returns all', () => {
  addFavorite('a', 'https://a.com');
  addFavorite('b', 'https://b.com');
  expect(loadFavorites()).toHaveLength(2);
});

test('removeFavorite removes entry', () => {
  addFavorite('gh', 'https://github.com');
  removeFavorite('gh');
  expect(loadFavorites()).toHaveLength(0);
});

test('removeFavorite throws if not found', () => {
  expect(() => removeFavorite('nope')).toThrow("Favorite 'nope' not found");
});

test('getFavorite returns entry', () => {
  addFavorite('gh', 'https://github.com');
  expect(getFavorite('gh').url).toBe('https://github.com');
});

test('searchFavorites matches by name and url', () => {
  addFavorite('github', 'https://github.com', ['dev']);
  addFavorite('news', 'https://hn.com', ['reading']);
  expect(searchFavorites('git')).toHaveLength(1);
  expect(searchFavorites('dev')).toHaveLength(1);
  expect(searchFavorites('hn')).toHaveLength(1);
});
