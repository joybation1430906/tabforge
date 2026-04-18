const fs = require('fs');
const { sessionToYaml, exportSession } = require('./export');
const session = require('./session');

jest.mock('./session');
jest.mock('fs');

describe('sessionToYaml', () => {
  it('renders name and flat tabs', () => {
    const result = sessionToYaml({
      name: 'work',
      tabs: [{ url: 'https://github.com' }, { url: 'https://linear.app', title: 'Linear' }],
    });
    expect(result).toContain('name: work');
    expect(result).toContain('- url: https://github.com');
    expect(result).toContain('title: Linear');
  });

  it('renders browser field when present', () => {
    const result = sessionToYaml({ name: 'test', browser: 'firefox', tabs: [] });
    expect(result).toContain('browser: firefox');
  });

  it('renders groups with tabs', () => {
    const result = sessionToYaml({
      name: 'grouped',
      groups: [
        { name: 'dev', tabs: [{ url: 'https://localhost:3000' }] },
      ],
    });
    expect(result).toContain('groups:');
    expect(result).toContain('name: dev');
    expect(result).toContain('url: https://localhost:3000');
  });

  it('renders pinned tabs', () => {
    const result = sessionToYaml({ name: 's', tabs: [{ url: 'https://x.com', pinned: true }] });
    expect(result).toContain('pinned: true');
  });
});

describe('exportSession', () => {
  it('writes yaml to the given path', () => {
    session.loadSession.mockReturnValue({ name: 'work', tabs: [{ url: 'https://example.com' }] });
    fs.writeFileSync.mockImplementation(() => {});

    const out = exportSession('work', '/tmp/work.yaml');
    expect(out).toBe('/tmp/work.yaml');
    expect(fs.writeFileSync).toHaveBeenCalledWith('/tmp/work.yaml', expect.stringContaining('name: work'), 'utf8');
  });

  it('defaults output path to sessionName.yaml', () => {
    session.loadSession.mockReturnValue({ name: 'dev', tabs: [] });
    fs.writeFileSync.mockImplementation(() => {});

    const out = exportSession('dev');
    expect(out).toBe('dev.yaml');
  });

  it('throws when session not found', () => {
    session.loadSession.mockReturnValue(null);
    expect(() => exportSession('ghost')).toThrow('Session "ghost" not found.');
  });
});
