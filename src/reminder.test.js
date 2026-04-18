const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('os', () => ({ homedir: () => '/tmp/tabforge-test-reminder' }));

const { addReminder, removeReminder, loadReminders, getDueReminders, toggleReminder } = require('./reminder');

const TEST_DIR = '/tmp/tabforge-test-reminder/.tabforge';

afterEach(() => {
  if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
});

test('addReminder creates a reminder', () => {
  const r = addReminder('standup', 'https://meet.example.com', 'Daily standup', '2099-01-01T09:00:00Z');
  expect(r.name).toBe('standup');
  expect(r.active).toBe(true);
  const all = loadReminders();
  expect(all).toHaveLength(1);
});

test('addReminder throws on duplicate', () => {
  addReminder('dup', 'https://a.com', '', '2099-01-01T00:00:00Z');
  expect(() => addReminder('dup', 'https://b.com', '', '2099-01-01T00:00:00Z')).toThrow("Reminder 'dup' already exists");
});

test('removeReminder removes correctly', () => {
  addReminder('r1', 'https://x.com', '', '2099-01-01T00:00:00Z');
  removeReminder('r1');
  expect(loadReminders()).toHaveLength(0);
});

test('removeReminder throws if not found', () => {
  expect(() => removeReminder('ghost')).toThrow("Reminder 'ghost' not found");
});

test('getDueReminders returns past reminders', () => {
  addReminder('past', 'https://old.com', '', '2000-01-01T00:00:00Z');
  addReminder('future', 'https://new.com', '', '2099-01-01T00:00:00Z');
  const due = getDueReminders();
  expect(due).toHaveLength(1);
  expect(due[0].name).toBe('past');
});

test('toggleReminder flips active state', () => {
  addReminder('tog', 'https://t.com', '', '2099-01-01T00:00:00Z');
  const r = toggleReminder('tog');
  expect(r.active).toBe(false);
  const r2 = toggleReminder('tog');
  expect(r2.active).toBe(true);
});
