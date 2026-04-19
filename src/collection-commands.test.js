jest.mock('os', () => ({ homedir: () => '/tmp/tabforge-test-col-cmd' }));

const { cmdCollectionCreate, cmdCollectionAdd, cmdCollectionList, cmdCollectionShow, cmdCollectionDelete, handleCollectionCommand } = require('./collection-commands');
const { loadCollection } = require('./collection');
const fs = require('fs');
const path = require('path');

beforeEach(() => {
  const dir = path.join('/tmp/tabforge-test-col-cmd', '.tabforge', 'collections');
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
});

test('cmdCollectionCreate creates a collection', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdCollectionCreate(['mylist']);
  const col = loadCollection('mylist');
  expect(col).not.toBeNull();
  spy.mockRestore();
});

test('cmdCollectionAdd adds url', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdCollectionCreate(['mylist2']);
  cmdCollectionAdd(['mylist2', 'https://example.com']);
  const col = loadCollection('mylist2');
  expect(col.urls).toContain('https://example.com');
  spy.mockRestore();
});

test('cmdCollectionList prints collections', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdCollectionCreate(['listed']);
  cmdCollectionList([]);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('listed'));
  spy.mockRestore();
});

test('cmdCollectionDelete removes collection', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdCollectionCreate(['todel']);
  cmdCollectionDelete(['todel']);
  expect(loadCollection('todel')).toBeNull();
  spy.mockRestore();
});

test('handleCollectionCommand dispatches correctly', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleCollectionCommand('create', ['dispatched']);
  expect(loadCollection('dispatched')).not.toBeNull();
  spy.mockRestore();
});
