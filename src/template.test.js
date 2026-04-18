const { listTemplates, getTemplate, templateToYaml, applyTemplate } = require('./template');

describe('listTemplates', () => {
  it('returns array of built-in templates', () => {
    const templates = listTemplates();
    expect(Array.isArray(templates)).toBe(true);
    expect(templates.length).toBeGreaterThan(0);
  });

  it('each template has name, description, and tabs', () => {
    listTemplates().forEach(t => {
      expect(t).toHaveProperty('name');
      expect(t).toHaveProperty('description');
      expect(Array.isArray(t.tabs)).toBe(true);
    });
  });
});

describe('getTemplate', () => {
  it('returns a known template by name', () => {
    const t = getTemplate('dev');
    expect(t).not.toBeNull();
    expect(t.name).toBe('dev');
  });

  it('returns null for unknown template', () => {
    expect(getTemplate('nonexistent')).toBeNull();
  });
});

describe('templateToYaml', () => {
  it('produces valid yaml string from template', () => {
    const t = getTemplate('research');
    const yml = templateToYaml(t);
    expect(typeof yml).toBe('string');
    expect(yml).toContain('session');
    expect(yml).toContain('tabs');
  });
});

describe('applyTemplate', () => {
  it('returns template config for valid name', () => {
    const result = applyTemplate('social');
    expect(result.name).toBe('social');
    expect(result.tabs.length).toBeGreaterThan(0);
  });

  it('applies overrides on top of template', () => {
    const result = applyTemplate('dev', { name: 'my-dev' });
    expect(result.name).toBe('my-dev');
    expect(result.tabs).toBeDefined();
  });

  it('throws for unknown template name', () => {
    expect(() => applyTemplate('ghost')).toThrow(/not found/);
  });
});
