const fs = require('fs');
const path = require('path');
const os = require('os');

let archiveModule;
const mockDir = path.join(os.tmpdir(), 'tabforge-archive-test-' + Date.now());

jest.mock('os', () => ({ homedir: () => path.dirname(mockDir.replace('/archive', '')) }));

beforeEach(() => {
  jest.resetModules();
  const realOs = jest.requireActual('os');
  jest.spyOn(realOs, 'homedir').mockReturnValue(path.join(os.tmpdir(), 'tabforge-archive-test-' + Date.now()));
  archiveModule = require('./archive');
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('archive', () => {
  test('archiveSession saves a file and returns filename', () => {
    const { archiveSession, listArchives } = require('./archive');
    const filename = archiveSession('mysession', { tabs: ['https://example.com'] });
    expect(filename).toMatch(/^mysession_.*\.json$/);
    const archives = listArchives();
    expect(archives.length).toBeGreaterThan(0);
    expect(archives[0].name).toBe('mysession');
  });

  test('loadArchive returns archived data', () => {
    const { archiveSession, loadArchive } = require('./archive');
    const filename = archiveSession('test', { tabs: ['https://test.com'] });
    const data = loadArchive(filename);
    expect(data.name).toBe('test');
    expect(data.tabs).toEqual(['https://test.com']);
    expect(data.archivedAt).toBeDefined();
  });

  test('loadArchive throws for missing file', () => {
    const { loadArchive } = require('./archive');
    expect(() => loadArchive('nonexistent.json')).toThrow('Archive not found');
  });

  test('deleteArchive removes the file', () => {
    const { archiveSession, deleteArchive, listArchives } = require('./archive');
    const filename = archiveSession('todelete', { tabs: [] });
    deleteArchive(filename);
    const archives = listArchives();
    expect(archives.find(a => a.file === filename)).toBeUndefined();
  });

  test('clearArchives removes all archives', () => {
    const { archiveSession, clearArchives, listArchives } = require('./archive');
    archiveSession('a', { tabs: [] });
    archiveSession('b', { tabs: [] });
    const count = clearArchives();
    expect(count).toBeGreaterThanOrEqual(2);
    expect(listArchives().length).toBe(0);
  });
});
