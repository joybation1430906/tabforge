const fs = require('fs');
const os = require('os');
const path = require('path');

function getModule() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-version-'));
  process.env.TABFORGE_DATA_DIR = tmpDir;
  jest.resetModules();
  return require('./version');
}

describe('version', () => {
  afterEach(() => {
    delete process.env.TABFORGE_DATA_DIR;
  });

  test('ensureVersionsDir creates directory', () => {
    const { ensureVersionsDir, getVersionPath } = getModule();
    ensureVersionsDir();
    const dir = path.dirname(getVersionPath('test'));
    expect(fs.existsSync(dir)).toBe(true);
  });

  test('loadVersions returns empty array when no file', () => {
    const { loadVersions } = getModule();
    expect(loadVersions('nonexistent')).toEqual([]);
  });

  test('pushVersion adds entry and returns it', () => {
    const { pushVersion, loadVersions } = getModule();
    const entry = pushVersion('mysession', { tabs: ['https://example.com'] });
    expect(entry.index).toBe(0);
    expect(entry.label).toBe('v1');
    expect(entry.data.tabs).toContain('https://example.com');
    const versions = loadVersions('mysession');
    expect(versions).toHaveLength(1);
  });

  test('pushVersion uses custom label', () => {
    const { pushVersion } = getModule();
    const entry = pushVersion('s', { tabs: [] }, 'initial');
    expect(entry.label).toBe('initial');
  });

  test('getVersion returns correct entry by index', () => {
    const { pushVersion, getVersion } = getModule();
    pushVersion('s', { tabs: ['a'] });
    pushVersion('s', { tabs: ['b'] });
    const v = getVersion('s', 1);
    expect(v.data.tabs).toContain('b');
  });

  test('getVersion returns null for out-of-range index', () => {
    const { getVersion } = getModule();
    expect(getVersion('s', 99)).toBeNull();
  });

  test('getLatestVersion returns last entry', () => {
    const { pushVersion, getLatestVersion } = getModule();
    pushVersion('s', { tabs: ['a'] });
    pushVersion('s', { tabs: ['b'] });
    const latest = getLatestVersion('s');
    expect(latest.index).toBe(1);
  });

  test('getLatestVersion returns null when no history', () => {
    const { getLatestVersion } = getModule();
    expect(getLatestVersion('empty')).toBeNull();
  });

  test('deleteVersionHistory removes the file', () => {
    const { pushVersion, deleteVersionHistory, getVersionPath } = getModule();
    pushVersion('s', { tabs: [] });
    deleteVersionHistory('s');
    expect(fs.existsSync(getVersionPath('s'))).toBe(false);
  });
});
