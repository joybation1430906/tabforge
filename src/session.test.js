const fs = require('fs');
const path = require('path');
const os = require('os');

// Override SESSION_DIR before requiring session module
const TEST_DIR = path.join(os.tmpdir(), 'tabforge-test-sessions-' + Date.now());
jest.mock('os', () => ({ homedir: () => path.dirname(TEST_DIR.replace('/.tabforge/sessions', '')) }));

// Use a temp dir for tests
const { saveSession, loadSession, listSessions, deleteSession } = require('./session');

afterAll(() => {
  fs.rmSync(TEST_DIR, { recursive: true, force: true });
});

describe('session management', () => {
  const tabs = ['https://example.com', 'https://github.com'];

  test('saveSession writes a json file', () => {
    const filePath = saveSession('work', tabs);
    expect(fs.existsSync(filePath)).toBe(true);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    expect(data.name).toBe('work');
    expect(data.tabs).toEqual(tabs);
    expect(data.savedAt).toBeDefined();
  });

  test('loadSession returns saved session', () => {
    saveSession('research', tabs);
    const session = loadSession('research');
    expect(session.name).toBe('research');
    expect(session.tabs).toEqual(tabs);
  });

  test('loadSession throws for missing session', () => {
    expect(() => loadSession('nonexistent')).toThrow('Session "nonexistent" not found.');
  });

  test('listSessions returns session names', () => {
    saveSession('alpha', tabs);
    saveSession('beta', tabs);
    const sessions = listSessions();
    expect(sessions).toEqual(expect.arrayContaining(['alpha', 'beta']));
  });

  test('deleteSession removes the file', () => {
    saveSession('temp', tabs);
    deleteSession('temp');
    expect(() => loadSession('temp')).toThrow();
  });

  test('deleteSession throws for missing session', () => {
    expect(() => deleteSession('ghost')).toThrow('Session "ghost" not found.');
  });
});
