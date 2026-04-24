const fs = require('fs');
const path = require('path');
const os = require('os');

function getModule(chainsDir) {
  jest.resetModules();
  jest.doMock('os', () => ({ homedir: () => chainsDir }));
  return require('./chain');
}

describe('chain', () => {
  let tmpDir;
  let chain;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-chain-'));
    chain = getModule(tmpDir);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('saveChain creates a chain file', () => {
    const result = chain.saveChain('mychain', ['open google', 'open github']);
    expect(result.name).toBe('mychain');
    expect(result.steps).toHaveLength(2);
    expect(result.createdAt).toBeDefined();
  });

  test('loadChain returns null for missing chain', () => {
    const result = chain.loadChain('nope');
    expect(result).toBeNull();
  });

  test('loadChain returns saved chain', () => {
    chain.saveChain('dev', ['open localhost:3000']);
    const result = chain.loadChain('dev');
    expect(result.name).toBe('dev');
    expect(result.steps).toContain('open localhost:3000');
  });

  test('listChains returns all chain names', () => {
    chain.saveChain('alpha', []);
    chain.saveChain('beta', []);
    const list = chain.listChains();
    expect(list).toContain('alpha');
    expect(list).toContain('beta');
  });

  test('deleteChain removes the file', () => {
    chain.saveChain('todelete', []);
    const removed = chain.deleteChain('todelete');
    expect(removed).toBe(true);
    expect(chain.loadChain('todelete')).toBeNull();
  });

  test('deleteChain returns false for missing chain', () => {
    expect(chain.deleteChain('ghost')).toBe(false);
  });

  test('renameChain renames correctly', () => {
    chain.saveChain('oldname', ['step1']);
    const ok = chain.renameChain('oldname', 'newname');
    expect(ok).toBe(true);
    expect(chain.loadChain('newname').name).toBe('newname');
    expect(chain.loadChain('oldname')).toBeNull();
  });

  test('appendStep adds a step to existing chain', () => {
    chain.saveChain('mychain', ['step1']);
    const updated = chain.appendStep('mychain', 'step2');
    expect(updated.steps).toHaveLength(2);
    expect(updated.steps[1]).toBe('step2');
  });

  test('appendStep returns null for missing chain', () => {
    expect(chain.appendStep('ghost', 'step')).toBeNull();
  });
});
