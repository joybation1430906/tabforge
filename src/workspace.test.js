const fs = require('fs');
const os = require('os');
const path = require('path');

const tmpDir = path.join(os.tmpdir(), 'tabforge-workspace-test-' + Date.now());
jest.mock('os', () => ({ ...jest.requireActual('os'), homedir: () => tmpDir }));

const { saveWorkspace, loadWorkspace, listWorkspaces, deleteWorkspace, renameWorkspace } = require('./workspace');

describe('workspace', () => {
  afterAll(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

  test('saveWorkspace creates file', () => {
    saveWorkspace('myws', { description: 'test', tabs: [] });
    const ws = loadWorkspace('myws');
    expect(ws).not.toBeNull();
    expect(ws.name).toBe('myws');
    expect(ws.description).toBe('test');
  });

  test('loadWorkspace returns null for missing', () => {
    expect(loadWorkspace('nope')).toBeNull();
  });

  test('listWorkspaces returns names', () => {
    saveWorkspace('ws1', { tabs: [] });
    saveWorkspace('ws2', { tabs: [] });
    const list = listWorkspaces();
    expect(list).toContain('ws1');
    expect(list).toContain('ws2');
  });

  test('deleteWorkspace removes file', () => {
    saveWorkspace('todelete', { tabs: [] });
    expect(deleteWorkspace('todelete')).toBe(true);
    expect(loadWorkspace('todelete')).toBeNull();
  });

  test('deleteWorkspace returns false if not found', () => {
    expect(deleteWorkspace('ghost')).toBe(false);
  });

  test('renameWorkspace renames correctly', () => {
    saveWorkspace('oldname', { description: 'rename me', tabs: [] });
    expect(renameWorkspace('oldname', 'newname')).toBe(true);
    expect(loadWorkspace('oldname')).toBeNull();
    const ws = loadWorkspace('newname');
    expect(ws.name).toBe('newname');
  });

  test('renameWorkspace returns false if not found', () => {
    expect(renameWorkspace('missing', 'other')).toBe(false);
  });
});
