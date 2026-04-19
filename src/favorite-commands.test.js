const fs = require('fs');
const path = require('path');

jest.mock('os', () => ({ homedir: () => '/tmp/tabforge-test-favcmd' }));

const { cmdFavoriteAdd, cmdFavoriteRemove, cmdFavoriteList, cmdFavoriteSearch } = require('./favorite-commands');
const { loadFavorites } = require('./favorite');

const BASE = path.join('/tmp/tabforge-test-favcmd', '.tabforge');

beforeEach(() => {
  fs.rmSync(BASE, { recursive: true, force: true });
});

test('cmdFavoriteAdd adds favorite', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdFavoriteAdd(['gh', 'https://github.com', 'dev']);
  expect(loadFavorites()).toHaveLength(1);
  spy.mockRestore();
});

test('cmdFavoriteRemove removes favorite', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdFavoriteAdd(['gh', 'https://github.com']);
  cmdFavoriteRemove(['gh']);
  expect(loadFavorites()).toHaveLength(0);
  spy.mockRestore();
});

test('cmdFavoriteList prints favorites', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdFavoriteAdd(['gh', 'https://github.com', 'dev']);
  cmdFavoriteList();
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('gh'));
  spy.mockRestore();
});

test('cmdFavoriteList empty message', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdFavoriteList();
  expect(spy).toHaveBeenCalledWith('No favorites saved.');
  spy.mockRestore();
});

test('cmdFavoriteSearch finds match', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdFavoriteAdd(['gh', 'https://github.com']);
  cmdFavoriteSearch(['github']);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('gh'));
  spy.mockRestore();
});
