const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('fs');

const LOG_FILE = path.join(os.homedir(), '.tabforge', 'activity.log');

function getModule() {
  jest.resetModules();
  return require('./log');
}

beforeEach(() => {
  fs.existsSync.mockReturnValue(true);
  fs.mkdirSync.mockImplementation(() => {});
  fs.writeFileSync.mockImplementation(() => {});
});

test('loadLog returns empty array on bad json', () => {
  fs.readFileSync.mockReturnValue('not json');
  const { loadLog } = getModule();
  expect(loadLog()).toEqual([]);
});

test('recordLog adds entry to front', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify([]));
  const { recordLog } = getModule();
  const entry = recordLog('launch', { url: 'https://example.com' });
  expect(entry.action).toBe('launch');
  expect(entry.url).toBe('https://example.com');
  expect(entry.timestamp).toBeDefined();
});

test('getLog returns limited entries', () => {
  const entries = Array.from({ length: 50 }, (_, i) => ({ action: 'open', i }));
  fs.readFileSync.mockReturnValue(JSON.stringify(entries));
  const { getLog } = getModule();
  expect(getLog(10)).toHaveLength(10);
});

test('clearLog writes empty array', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify([]));
  const { clearLog } = getModule();
  clearLog();
  const written = JSON.parse(fs.writeFileSync.mock.calls.at(-1)[1]);
  expect(written).toEqual([]);
});

test('filterLog returns matching actions', () => {
  const entries = [
    { action: 'launch', url: 'a' },
    { action: 'save', name: 'b' },
    { action: 'launch', url: 'c' },
  ];
  fs.readFileSync.mockReturnValue(JSON.stringify(entries));
  const { filterLog } = getModule();
  expect(filterLog('launch')).toHaveLength(2);
});
