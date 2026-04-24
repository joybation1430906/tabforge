const fs = require('fs');
const path = require('path');
const os = require('os');

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-ratingcmd-'));

let cmds;
let logs;

beforeEach(() => {
  jest.resetModules();
  jest.doMock('os', () => ({ homedir: () => tmpDir }));
  const ratingsFile = path.join(tmpDir, 'ratings.json');
  if (fs.existsSync(ratingsFile)) fs.unlinkSync(ratingsFile);
  cmds = require('./rating-commands');
  logs = [];
  jest.spyOn(console, 'log').mockImplementation((...args) => logs.push(args.join(' ')));
});

afterEach(() => jest.restoreAllMocks());

test('cmdRatingAdd prints rating', () => {
  cmds.cmdRatingAdd(['mysession', '4', 'great']);
  expect(logs[0]).toContain('mysession');
  expect(logs[0]).toContain('4/5');
});

test('cmdRatingAdd shows usage without args', () => {
  cmds.cmdRatingAdd([]);
  expect(logs[0]).toContain('Usage');
});

test('cmdRatingAdd rejects bad score', () => {
  cmds.cmdRatingAdd(['x', 'abc']);
  expect(logs[0]).toContain('number');
});

test('cmdRatingRemove removes entry', () => {
  cmds.cmdRatingAdd(['toremove', '3']);
  logs = [];
  cmds.cmdRatingRemove(['toremove']);
  expect(logs[0]).toContain('Removed');
});

test('cmdRatingShow displays entry', () => {
  cmds.cmdRatingAdd(['showme', '5', 'awesome']);
  logs = [];
  cmds.cmdRatingShow(['showme']);
  expect(logs[0]).toContain('5/5');
});

test('cmdRatingList shows all', () => {
  cmds.cmdRatingAdd(['a', '1']);
  cmds.cmdRatingAdd(['b', '2']);
  logs = [];
  cmds.cmdRatingList();
  expect(logs.length).toBe(2);
});

test('cmdRatingTop shows top entries', () => {
  cmds.cmdRatingAdd(['low', '1']);
  cmds.cmdRatingAdd(['high', '5']);
  logs = [];
  cmds.cmdRatingTop(['1']);
  expect(logs[1]).toContain('high');
});

test('handleRatingCommand routes correctly', () => {
  cmds.handleRatingCommand('list', []);
  expect(logs[0]).toContain('No ratings');
});

test('handleRatingCommand unknown sub', () => {
  cmds.handleRatingCommand('bogus', []);
  expect(logs[0]).toContain('Unknown');
});
