const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('fs');

const LABELS_FILE = path.join(os.homedir(), '.tabforge', 'labels.json');

let mod;
function getModule() {
  jest.resetModules();
  return require('./label');
}

beforeEach(() => {
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue(JSON.stringify({}));
  fs.writeFileSync.mockImplementation(() => {});
  fs.mkdirSync.mockImplementation(() => {});
  mod = getModule();
});

test('addLabel creates a new label', () => {
  const label = mod.addLabel('work', 'blue', 'Work stuff');
  expect(label.color).toBe('blue');
  expect(label.description).toBe('Work stuff');
  expect(fs.writeFileSync).toHaveBeenCalled();
});

test('addLabel throws if label exists', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify({ work: { color: 'blue', description: '' } }));
  mod = getModule();
  expect(() => mod.addLabel('work')).toThrow("Label 'work' already exists");
});

test('removeLabel deletes a label', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify({ work: { color: 'blue', description: '' } }));
  mod = getModule();
  mod.removeLabel('work');
  expect(fs.writeFileSync).toHaveBeenCalled();
});

test('removeLabel throws if not found', () => {
  expect(() => mod.removeLabel('nope')).toThrow("Label 'nope' not found");
});

test('listLabels returns array', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify({ a: { color: 'red' }, b: { color: 'green' } }));
  mod = getModule();
  const list = mod.listLabels();
  expect(list).toHaveLength(2);
  expect(list[0].name).toBe('a');
});

test('updateLabel modifies existing label', () => {
  fs.readFileSync.mockReturnValue(JSON.stringify({ work: { color: 'blue', description: 'old' } }));
  mod = getModule();
  const updated = mod.updateLabel('work', { color: 'green' });
  expect(updated.color).toBe('green');
});
