const { getBrowserCommand, launchSession } = require('./launcher');
const { exec } = require('child_process');

jest.mock('child_process', () => ({ exec: jest.fn() }));
jest.mock('os', () => ({ platform: jest.fn(() => 'linux') }));

describe('getBrowserCommand', () => {
  it('returns chrome command on linux', () => {
    const cmd = getBrowserCommand('chrome');
    expect(cmd).toBe('google-chrome');
  });

  it('falls back to default for unknown browser', () => {
    const cmd = getBrowserCommand('unknownbrowser');
    expect(cmd).toBe('xdg-open');
  });
});

describe('launchSession', () => {
  beforeEach(() => {
    exec.mockReset();
  });

  it('opens all tabs and returns results', async () => {
    exec.mockImplementation((cmd, cb) => cb(null));

    const session = {
      tabs: [
        { url: 'https://example.com' },
        { url: 'https://github.com' }
      ]
    };

    const results = await launchSession(session, { delay: 0 });
    expect(results.opened).toHaveLength(2);
    expect(results.failed).toHaveLength(0);
    expect(results.opened).toContain('https://example.com');
  });

  it('records failed tabs on exec error', async () => {
    exec.mockImplementation((cmd, cb) => cb(new Error('not found')));

    const session = { tabs: [{ url: 'https://fail.com' }] };
    const results = await launchSession(session, { delay: 0 });

    expect(results.failed).toHaveLength(1);
    expect(results.failed[0].url).toBe('https://fail.com');
    expect(results.opened).toHaveLength(0);
  });

  it('uses tab-level browser override', async () => {
    exec.mockImplementation((cmd, cb) => cb(null));

    const session = { tabs: [{ url: 'https://example.com', browser: 'firefox' }] };
    await launchSession(session, { delay: 0 });

    expect(exec).toHaveBeenCalledWith(
      expect.stringContaining('firefox'),
      expect.any(Function)
    );
  });
});
