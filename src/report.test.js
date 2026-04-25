const { buildReport, saveReport, loadReport, listReports, deleteReport, ensureReportsDir } = require('./report');
const fs = require('fs');
const path = require('path');
const os = require('os');

jest.mock('fs');

const REPORTS_DIR = path.join(os.homedir(), '.tabforge', 'reports');

beforeEach(() => {
  jest.clearAllMocks();
  fs.existsSync.mockReturnValue(true);
  fs.readdirSync.mockReturnValue([]);
});

test('buildReport returns correct structure', () => {
  const r = buildReport('weekly', { history: [{}, {}], sessions: ['a'], tags: ['work', 'work', 'dev'] });
  expect(r.name).toBe('weekly');
  expect(r.totalLaunches).toBe(2);
  expect(r.totalSessions).toBe(1);
  expect(r.tagBreakdown.work).toBe(2);
  expect(r.tagBreakdown.dev).toBe(1);
});

test('buildReport handles missing data', () => {
  const r = buildReport('empty', {});
  expect(r.totalLaunches).toBe(0);
  expect(r.totalSessions).toBe(0);
});

test('saveReport writes file', () => {
  fs.writeFileSync.mockImplementation(() => {});
  saveReport('test', { name: 'test' });
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    path.join(REPORTS_DIR, 'test.json'),
    expect.any(String)
  );
});

test('loadReport returns null when not found', () => {
  fs.existsSync.mockReturnValue(false);
  expect(loadReport('missing')).toBeNull();
});

test('loadReport parses file', () => {
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify({ name: 'x', totalLaunches: 5 }));
  const r = loadReport('x');
  expect(r.totalLaunches).toBe(5);
});

test('listReports returns names', () => {
  fs.readdirSync.mockReturnValue(['a.json', 'b.json', 'notes.txt']);
  expect(listReports()).toEqual(['a', 'b']);
});

test('deleteReport returns false when not found', () => {
  fs.existsSync.mockReturnValue(false);
  expect(deleteReport('ghost')).toBe(false);
});

test('deleteReport removes file', () => {
  fs.existsSync.mockReturnValue(true);
  fs.unlinkSync.mockImplementation(() => {});
  expect(deleteReport('old')).toBe(true);
  expect(fs.unlinkSync).toHaveBeenCalled();
});
