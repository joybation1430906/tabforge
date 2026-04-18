const fs = require('fs');
const path = require('path');
const os = require('os');

jest.mock('fs');

const HISTORY_DIR = path.join(os.homedir(), '.tabforge');
const HISTORY_FILE = path.join(HISTORY_DIR, 'history.json');

const { recordLaunch, getHistory, clearHistory, deleteHistoryEntry } = require('./history');

beforeEach(() => {
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify([]));
  fs.writeFileSync.mockImplementation(() => {});
  fs.mkdirSync.mockImplementation(() => {});
});

test('recordLaunch writes entry to history', () => {
  const entry = recordLaunch('session.yaml', ['https://a.com', 'https://b.com']);
  expect(entry.urls).toEqual(['https://a.com', 'https://b.com']);
  expect(entry.count).toBe(2);
  expect(fs.writeFileSync).toHaveBeenCalled();
});

test('getHistory respects limit', () => {
  const many = Array.from({ length: 20 }, (_, i) => ({ id: i, timestamp: '', configPath: '', urls: [], count: 0 }));
  fs.readFileSync.mockReturnValue(JSON.stringify(many));
  const result = getHistory(5);
  expect(result).toHaveLength(5);
});

test('clearHistory empties the list', () => {
  clearHistory();
  const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
  expect(written).toEqual([]);
});

test('deleteHistoryEntry removes matching id', () => {
  const entries = [{ id: 1, timestamp: '', configPath: '', urls: [], count: 0 }];
  fs.readFileSync.mockReturnValue(JSON.stringify(entries));
  const result = deleteHistoryEntry(1);
  expect(result).toBe(true);
  const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
  expect(written).toHaveLength(0);
});

test('deleteHistoryEntry returns false when id not found', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify([]));
  const result = deleteHistoryEntry(999);
  expect(result).toBe(false);
});
