jest.mock('./watchlist');
const watchlist = require('./watchlist');
const { cmdWatchlistAdd, cmdWatchlistRemove, cmdWatchlistList, cmdWatchlistClear, handleWatchlistCommand } = require('./watchlist-commands');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => console.log.mockRestore());

test('cmdWatchlistAdd calls addToWatchlist', () => {
  watchlist.addToWatchlist.mockReturnValue({ url: 'https://x.com', label: 'X' });
  cmdWatchlistAdd(['https://x.com', 'X']);
  expect(watchlist.addToWatchlist).toHaveBeenCalledWith('https://x.com', 'X');
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Added'));
});

test('cmdWatchlistAdd shows usage if no url', () => {
  cmdWatchlistAdd([]);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Usage'));
});

test('cmdWatchlistAdd handles error', () => {
  watchlist.addToWatchlist.mockImplementation(() => { throw new Error('already in watchlist'); });
  cmdWatchlistAdd(['https://dup.com']);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Error'));
});

test('cmdWatchlistRemove calls removeFromWatchlist', () => {
  watchlist.removeFromWatchlist.mockReturnValue();
  cmdWatchlistRemove(['https://x.com']);
  expect(watchlist.removeFromWatchlist).toHaveBeenCalledWith('https://x.com');
});

test('cmdWatchlistList shows entries', () => {
  watchlist.getWatchlist.mockReturnValue([{ url: 'https://a.com', label: 'A', notified: false }]);
  cmdWatchlistList();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('A'));
});

test('cmdWatchlistList shows empty message', () => {
  watchlist.getWatchlist.mockReturnValue([]);
  cmdWatchlistList();
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('empty'));
});

test('cmdWatchlistClear calls clearWatchlist', () => {
  cmdWatchlistClear();
  expect(watchlist.clearWatchlist).toHaveBeenCalled();
});

test('handleWatchlistCommand routes correctly', () => {
  watchlist.getWatchlist.mockReturnValue([]);
  handleWatchlistCommand('list', []);
  expect(watchlist.getWatchlist).toHaveBeenCalled();
});

test('handleWatchlistCommand handles unknown sub', () => {
  handleWatchlistCommand('nope', []);
  expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Unknown'));
});
