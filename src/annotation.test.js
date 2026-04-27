const fs = require('fs');
const path = require('path');
const os = require('os');

let mod;
function getModule() {
  jest.resetModules();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tabforge-ann-'));
  const filePath = path.join(tmpDir, 'annotations.json');
  jest.doMock('os', () => ({ homedir: () => tmpDir }));
  mod = require('./annotation');
  return mod;
}

describe('annotation', () => {
  beforeEach(() => { mod = getModule(); });

  test('addAnnotation creates an entry', () => {
    const ann = mod.addAnnotation('session:work', 'important tabs', ['work']);
    expect(ann.id).toMatch(/^ann_/);
    expect(ann.target).toBe('session:work');
    expect(ann.note).toBe('important tabs');
    expect(ann.tags).toEqual(['work']);
    expect(ann.createdAt).toBeDefined();
  });

  test('listAnnotations returns all entries', () => {
    mod.addAnnotation('a', 'note1');
    mod.addAnnotation('b', 'note2');
    expect(mod.listAnnotations()).toHaveLength(2);
  });

  test('getAnnotationsForTarget filters by target', () => {
    mod.addAnnotation('session:work', 'n1');
    mod.addAnnotation('session:home', 'n2');
    const results = mod.getAnnotationsForTarget('session:work');
    expect(results).toHaveLength(1);
    expect(results[0].target).toBe('session:work');
  });

  test('removeAnnotation deletes entry', () => {
    const ann = mod.addAnnotation('x', 'to remove');
    mod.removeAnnotation(ann.id);
    expect(mod.listAnnotations()).toHaveLength(0);
  });

  test('removeAnnotation throws for unknown id', () => {
    expect(() => mod.removeAnnotation('bad_id')).toThrow("Annotation 'bad_id' not found");
  });

  test('searchAnnotations matches note text', () => {
    mod.addAnnotation('s1', 'daily standup');
    mod.addAnnotation('s2', 'weekend project');
    const results = mod.searchAnnotations('daily');
    expect(results).toHaveLength(1);
    expect(results[0].note).toBe('daily standup');
  });

  test('searchAnnotations matches tags', () => {
    mod.addAnnotation('s1', 'note', ['urgent', 'work']);
    mod.addAnnotation('s2', 'other', ['personal']);
    expect(mod.searchAnnotations('urgent')).toHaveLength(1);
  });
});
