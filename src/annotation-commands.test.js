jest.mock('./annotation');
const ann = require('./annotation');
const { cmdAnnotationAdd, cmdAnnotationRemove, cmdAnnotationList, cmdAnnotationSearch, handleAnnotationCommand } = require('./annotation-commands');

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => console.log.mockRestore());

describe('cmdAnnotationAdd', () => {
  test('adds annotation and logs id', () => {
    ann.addAnnotation.mockReturnValue({ id: 'ann_1', target: 'session:work' });
    cmdAnnotationAdd(['session:work', 'my note', 'tag1,tag2']);
    expect(ann.addAnnotation).toHaveBeenCalledWith('session:work', 'my note', ['tag1', 'tag2']);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('ann_1'));
  });

  test('shows usage when args missing', () => {
    cmdAnnotationAdd([]);
    expect(ann.addAnnotation).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Usage'));
  });
});

describe('cmdAnnotationRemove', () => {
  test('removes annotation', () => {
    ann.removeAnnotation.mockImplementation(() => {});
    cmdAnnotationRemove(['ann_1']);
    expect(ann.removeAnnotation).toHaveBeenCalledWith('ann_1');
  });

  test('handles error', () => {
    ann.removeAnnotation.mockImplementation(() => { throw new Error('not found'); });
    cmdAnnotationRemove(['bad']);
    expect(console.log).toHaveBeenCalledWith('not found');
  });
});

describe('cmdAnnotationList', () => {
  test('lists all when no target', () => {
    ann.listAnnotations.mockReturnValue([{ id: 'ann_1', target: 'x', note: 'n', tags: [] }]);
    cmdAnnotationList([]);
    expect(ann.listAnnotations).toHaveBeenCalled();
  });

  test('lists by target when provided', () => {
    ann.getAnnotationsForTarget.mockReturnValue([]);
    cmdAnnotationList(['session:work']);
    expect(ann.getAnnotationsForTarget).toHaveBeenCalledWith('session:work');
    expect(console.log).toHaveBeenCalledWith('No annotations found.');
  });
});

describe('handleAnnotationCommand', () => {
  test('routes to search', () => {
    ann.searchAnnotations.mockReturnValue([]);
    handleAnnotationCommand('search', ['query']);
    expect(ann.searchAnnotations).toHaveBeenCalledWith('query');
  });

  test('handles unknown subcommand', () => {
    handleAnnotationCommand('nope', []);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Unknown'));
  });
});
