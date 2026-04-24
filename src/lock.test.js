const fs = require('fs');
const path = require('path');
const os = require('os');

jest.mock('fs');

const LOCK_DIR = path.join(os.homedir(), '.tabforge', 'locks');

function getModule() {
  jest.resetModules();
  return require('./lock');
}

beforeEach(() => {
  fs.existsSync.mockReturnValue(false);
  fs.mkdirSync.mockImplementation(() => {});
  fs.writeFileSync.mockImplementation(() => {});
  fs.unlinkSync.mockImplementation(() => {});
  fs.readdirSync.mockReturnValue([]);
  fs.readFileSync.mockReturnValue('{}');
});

test('acquireLock returns acquired true when no lock exists', () => {
  const { acquireLock } = getModule();
  fs.existsSync.mockReturnValue(false);
  const result = acquireLock('mysession');
  expect(result.acquired).toBe(true);
  expect(fs.writeFileSync).toHaveBeenCalled();
});

test('acquireLock returns acquired false when lock exists', () => {
  const { acquireLock } = getModule();
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify({ pid: 9999, since: '2024-01-01T00:00:00.000Z' }));
  const result = acquireLock('mysession');
  expect(result.acquired).toBe(false);
  expect(result.lockedBy).toBe(9999);
});

test('releaseLock removes lock file if owned by current process', () => {
  const { releaseLock } = getModule();
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify({ pid: process.pid }));
  const result = releaseLock('mysession');
  expect(result).toBe(true);
  expect(fs.unlinkSync).toHaveBeenCalled();
});

test('releaseLock returns false if not owned by current process', () => {
  const { releaseLock } = getModule();
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify({ pid: 9999 }));
  const result = releaseLock('mysession');
  expect(result).toBe(false);
});

test('isLocked returns true when lock file exists', () => {
  const { isLocked } = getModule();
  fs.existsSync.mockReturnValue(true);
  expect(isLocked('mysession')).toBe(true);
});

test('listLocks returns all active locks', () => {
  const { listLocks } = getModule();
  fs.existsSync.mockReturnValue(true);
  fs.readdirSync.mockReturnValue(['mysession.lock', 'other.lock']);
  const lockData = { pid: 1234, since: '2024-01-01T00:00:00.000Z', name: 'mysession' };
  fs.readFileSync.mockReturnValue(JSON.stringify(lockData));
  const locks = listLocks();
  expect(locks).toHaveLength(2);
});

test('forceRelease removes lock regardless of owner', () => {
  const { forceRelease } = getModule();
  fs.existsSync.mockReturnValue(true);
  const result = forceRelease('mysession');
  expect(result).toBe(true);
  expect(fs.unlinkSync).toHaveBeenCalled();
});
