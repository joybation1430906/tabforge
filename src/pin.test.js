const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('os', () => ({ homedir: () => '/tmp/tabforge-test-pin' }));

const { addPin, removePin, loadPins, getPin, searchPins } = require('./pin');

const PINS_FILE = path.join('/tmp/tabforge-test-pin', '.tabforge', 'pins.json');

afterEach(() => {
  if (fs.existsSync(PINS_FILE)) fs.writeFileSync(PINS_FILE, JSON.stringify([]));
});

test('addPin adds a pin', () => {
  const pin = addPin('gh', 'https://github.com', 'GitHub');
  expect(pin.name).toBe('gh');
  expect(pin.url).toBe('https://github.com');
  expect(pin.label).toBe('GitHub');
});

test('addPin throws on duplicate', () => {
  addPin('gh', 'https://github.com');
  expect(() => addPin('gh', 'https://github.com')).toThrow("Pin 'gh' already exists");
});

test('loadPins returns all pins', () => {
  addPin('a', 'https://a.com');
  addPin('b', 'https://b.com');
  expect(loadPins()).toHaveLength(2);
});

test('removePin removes a pin', () => {
  addPin('gh', 'https://github.com');
  removePin('gh');
  expect(loadPins()).toHaveLength(0);
});

test('removePin throws if not found', () => {
  expect(() => removePin('nope')).toThrow("Pin 'nope' not found");
});

test('getPin returns pin by name', () => {
  addPin('gh', 'https://github.com', 'GitHub');
  const pin = getPin('gh');
  expect(pin.url).toBe('https://github.com');
});

test('searchPins filters by query', () => {
  addPin('gh', 'https://github.com', 'GitHub');
  addPin('ggl', 'https://google.com', 'Google');
  const results = searchPins('git');
  expect(results).toHaveLength(1);
  expect(results[0].name).toBe('gh');
});
