const fs = require('fs');
const os = require('os');
const path = require('path');

let tmpDir;
beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-schedule-'));
  jest.resetModules();
  process.env.HOME = tmpDir;
});

afterEach(() => fs.rmSync(tmpDir, { recursive: true }));

function getModule() { return require('./schedule'); }

test('loadSchedules returns empty array initially', () => {
  const { loadSchedules } = getModule();
  expect(loadSchedules()).toEqual([]);
});

test('addSchedule adds a schedule', () => {
  const { addSchedule, loadSchedules } = getModule();
  addSchedule('morning', 'work', '0 9 * * 1-5');
  const schedules = loadSchedules();
  expect(schedules).toHaveLength(1);
  expect(schedules[0].name).toBe('morning');
  expect(schedules[0].sessionName).toBe('work');
  expect(schedules[0].enabled).toBe(true);
});

test('addSchedule throws on duplicate name', () => {
  const { addSchedule } = getModule();
  addSchedule('morning', 'work', '0 9 * * 1-5');
  expect(() => addSchedule('morning', 'other', '0 8 * * *')).toThrow("Schedule 'morning' already exists");
});

test('removeSchedule removes a schedule', () => {
  const { addSchedule, removeSchedule, loadSchedules } = getModule();
  addSchedule('morning', 'work', '0 9 * * 1-5');
  removeSchedule('morning');
  expect(loadSchedules()).toHaveLength(0);
});

test('removeSchedule throws if not found', () => {
  const { removeSchedule } = getModule();
  expect(() => removeSchedule('ghost')).toThrow("Schedule 'ghost' not found");
});

test('getSchedule returns correct entry', () => {
  const { addSchedule, getSchedule } = getModule();
  addSchedule('morning', 'work', '0 9 * * 1-5');
  const s = getSchedule('morning');
  expect(s.cron).toBe('0 9 * * 1-5');
});

test('toggleSchedule disables a schedule', () => {
  const { addSchedule, toggleSchedule, getSchedule } = getModule();
  addSchedule('morning', 'work', '0 9 * * 1-5');
  toggleSchedule('morning', false);
  expect(getSchedule('morning').enabled).toBe(false);
});
