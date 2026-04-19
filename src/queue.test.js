const fs = require('fs');
const path = require('path');
const os = require('os');

let mod;
const QUEUE_DIR = path.join(os.homedir(), '.tabforge', 'queues');

beforeEach(() => {
  jest.resetModules();
  jest.mock('fs');
  fs.existsSync = jest.fn().mockReturnValue(true);
  fs.mkdirSync = jest.fn();
  fs.writeFileSync = jest.fn();
  fs.readdirSync = jest.fn().mockReturnValue([]);
  fs.unlinkSync = jest.fn();
  mod = require('./queue');
});

test('saveQueue writes file', () => {
  mod.saveQueue('work', [{ url: 'https://a.com', addedAt: 1 }]);
  expect(fs.writeFileSync).toHaveBeenCalled();
});

test('loadQueue returns null when missing', () => {
  fs.existsSync = jest.fn().mockReturnValue(false);
  expect(mod.loadQueue('nope')).toBeNull();
});

test('loadQueue returns parsed data', () => {
  fs.existsSync = jest.fn().mockReturnValue(true);
  fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify({ name: 'work', items: [], createdAt: 1 }));
  const q = mod.loadQueue('work');
  expect(q.name).toBe('work');
});

test('listQueues returns names', () => {
  fs.readdirSync = jest.fn().mockReturnValue(['work.json', 'home.json']);
  expect(mod.listQueues()).toEqual(['work', 'home']);
});

test('deleteQueue returns false if missing', () => {
  fs.existsSync = jest.fn().mockReturnValue(false);
  expect(mod.deleteQueue('ghost')).toBe(false);
});

test('deleteQueue removes file', () => {
  fs.existsSync = jest.fn().mockReturnValue(true);
  expect(mod.deleteQueue('work')).toBe(true);
  expect(fs.unlinkSync).toHaveBeenCalled();
});

test('addToQueue creates new queue if missing', () => {
  fs.existsSync = jest.fn().mockReturnValue(false);
  const count = mod.addToQueue('new', 'https://x.com');
  expect(count).toBe(1);
  expect(fs.writeFileSync).toHaveBeenCalled();
});
