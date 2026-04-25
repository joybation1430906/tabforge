const fs = require('fs');
const path = require('path');

let mod;
function getModule() {
  jest.resetModules();
  const os = require('os');
  jest.spyOn(os, 'homedir').mockReturnValue('/tmp/tabforge-event-test-' + Date.now());
  mod = require('./event');
  return mod;
}

describe('event', () => {
  beforeEach(() => { mod = getModule(); });

  test('ensureEventsDir creates directory', () => {
    mod.ensureEventsDir();
    expect(fs.existsSync(path.dirname(mod.getEventPath('x')))).toBe(true);
  });

  test('saveEvent and loadEvent round-trip', () => {
    const event = { name: 'standup', url: 'https://meet.example.com', createdAt: '2024-01-01' };
    mod.saveEvent('standup', event);
    const loaded = mod.loadEvent('standup');
    expect(loaded.name).toBe('standup');
    expect(loaded.url).toBe('https://meet.example.com');
  });

  test('loadEvent returns null for missing event', () => {
    expect(mod.loadEvent('nonexistent')).toBeNull();
  });

  test('listEvents returns saved events', () => {
    mod.saveEvent('alpha', { name: 'alpha' });
    mod.saveEvent('beta', { name: 'beta' });
    const list = mod.listEvents();
    expect(list).toContain('alpha');
    expect(list).toContain('beta');
  });

  test('deleteEvent removes event', () => {
    mod.saveEvent('temp', { name: 'temp' });
    expect(mod.deleteEvent('temp')).toBe(true);
    expect(mod.loadEvent('temp')).toBeNull();
  });

  test('deleteEvent returns false for missing event', () => {
    expect(mod.deleteEvent('ghost')).toBe(false);
  });

  test('renameEvent renames correctly', () => {
    mod.saveEvent('old', { name: 'old', url: 'https://example.com' });
    expect(mod.renameEvent('old', 'new')).toBe(true);
    expect(mod.loadEvent('new').name).toBe('new');
    expect(mod.loadEvent('old')).toBeNull();
  });

  test('renameEvent returns false for missing event', () => {
    expect(mod.renameEvent('nope', 'other')).toBe(false);
  });
});
