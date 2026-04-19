const fs = require('fs');
const path = require('path');
const os = require('os');

jest.mock('fs');

const DRAFTS_DIR = path.join(os.homedir(), '.tabforge', 'drafts');

let mod;
function getModule() {
  jest.resetModules();
  return require('./draft');
}

beforeEach(() => {
  jest.clearAllMocks();
  fs.existsSync.mockReturnValue(true);
  fs.mkdirSync.mockImplementation(() => {});
  mod = getModule();
});

test('saveDraft writes file', () => {
  fs.writeFileSync.mockImplementation(() => {});
  const result = mod.saveDraft('mywork', 'tabs:\n  - url: http://example.com');
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    path.join(DRAFTS_DIR, 'mywork.yaml'),
    'tabs:\n  - url: http://example.com',
    'utf8'
  );
  expect(result).toContain('mywork.yaml');
});

test('loadDraft returns content when file exists', () => {
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue('tabs: []');
  expect(mod.loadDraft('mywork')).toBe('tabs: []');
});

test('loadDraft returns null when file missing', () => {
  fs.existsSync.mockReturnValue(false);
  expect(mod.loadDraft('nope')).toBeNull();
});

test('listDrafts returns names without extension', () => {
  fs.readdirSync.mockReturnValue(['a.yaml', 'b.yaml', 'notes.txt']);
  expect(mod.listDrafts()).toEqual(['a', 'b']);
});

test('deleteDraft removes file and returns true', () => {
  fs.existsSync.mockReturnValue(true);
  fs.unlinkSync.mockImplementation(() => {});
  expect(mod.deleteDraft('mywork')).toBe(true);
  expect(fs.unlinkSync).toHaveBeenCalled();
});

test('deleteDraft returns false if not found', () => {
  fs.existsSync.mockReturnValue(false);
  expect(mod.deleteDraft('ghost')).toBe(false);
});

test('draftExists returns boolean', () => {
  fs.existsSync.mockReturnValue(true);
  expect(mod.draftExists('mywork')).toBe(true);
});
