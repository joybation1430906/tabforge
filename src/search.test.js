const { searchAll, formatResults } = require('./search');
const bookmark = require('./bookmark');
const history = require('./history');
const favorite = require('./favorite');
const snippet = require('./snippet');

jest.mock('./bookmark');
jest.mock('./history');
jest.mock('./favorite');
jest.mock('./snippet');

beforeEach(() => {
  bookmark.loadBookmarks.mockResolvedValue([{ url: 'https://github.com', title: 'GitHub' }]);
  history.loadHistory.mockResolvedValue([{ file: 'work.yaml', launchedAt: '2024-01-01' }]);
  favorite.loadFavorites.mockResolvedValue([{ name: 'MDN', url: 'https://mdn.io' }]);
  snippet.loadSnippets.mockResolvedValue([{ name: 'hello', content: 'console.log("hi")' }]);
});

test('returns bookmark match', async () => {
  const results = await searchAll('github');
  expect(results.some(r => r.type === 'bookmark' && r.name === 'GitHub')).toBe(true);
});

test('returns history match', async () => {
  const results = await searchAll('work');
  expect(results.some(r => r.type === 'history' && r.name === 'work.yaml')).toBe(true);
});

test('returns favorite match', async () => {
  const results = await searchAll('mdn');
  expect(results.some(r => r.type === 'favorite' && r.name === 'MDN')).toBe(true);
});

test('returns snippet match', async () => {
  const results = await searchAll('hello');
  expect(results.some(r => r.type === 'snippet' && r.name === 'hello')).toBe(true);
});

test('throws on empty query', async () => {
  await expect(searchAll('')).rejects.toThrow('Search query required');
});

test('formatResults handles empty', () => {
  expect(formatResults([])).toBe('No results found.');
});

test('formatResults formats items', () => {
  const out = formatResults([{ type: 'bookmark', name: 'GitHub', value: 'https://github.com' }]);
  expect(out).toContain('[bookmark]');
  expect(out).toContain('GitHub');
});
