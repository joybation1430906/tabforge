import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';

vi.mock('fs');

const mockEntries = [
  { name: 'work', type: 'session', openedAt: '2024-01-02T10:00:00.000Z' },
  { name: 'personal', type: 'session', openedAt: '2024-01-01T10:00:00.000Z' }
];

beforeEach(() => {
  vi.resetAllMocks();
  fs.existsSync = vi.fn().mockReturnValue(true);
  fs.readFileSync = vi.fn().mockReturnValue(JSON.stringify(mockEntries));
  fs.writeFileSync = vi.fn();
  fs.mkdirSync = vi.fn();
});

const getModule = () => import('./recent.js?t=' + Date.now());

describe('recent', () => {
  it('loadRecent returns parsed entries', async () => {
    const { loadRecent } = await getModule();
    const result = loadRecent();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('work');
  });

  it('recordRecent adds entry to front and deduplicates', async () => {
    const { recordRecent } = await getModule();
    recordRecent('personal', 'session');
    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written[0].name).toBe('personal');
    expect(written.filter(e => e.name === 'personal')).toHaveLength(1);
  });

  it('getRecent respects limit', async () => {
    const { getRecent } = await getModule();
    const result = getRecent(1);
    expect(result).toHaveLength(1);
  });

  it('clearRecent writes empty array', async () => {
    const { clearRecent } = await getModule();
    clearRecent();
    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written).toEqual([]);
  });

  it('removeRecent removes matching entry', async () => {
    const { removeRecent } = await getModule();
    removeRecent('work', 'session');
    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written.find(e => e.name === 'work')).toBeUndefined();
  });
});
