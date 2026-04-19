const { cmdBadgeAdd, cmdBadgeRemove, cmdBadgeList, cmdBadgeShow } = require('./badge-commands');

const mockAdd = jest.fn();
const mockRemove = jest.fn();
const mockList = jest.fn();
const mockGet = jest.fn();

jest.mock('./badge', () => ({
  addBadge: (...a) => mockAdd(...a),
  removeBadge: (...a) => mockRemove(...a),
  listBadges: (...a) => mockList(...a),
  getBadge: (...a) => mockGet(...a),
}));

beforeEach(() => jest.clearAllMocks());

test('cmdBadgeAdd calls addBadge and logs', () => {
  mockAdd.mockReturnValue({ name: 'ci', url: 'https://ci.com', label: 'CI' });
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdBadgeAdd(['ci', 'https://ci.com', 'CI']);
  expect(mockAdd).toHaveBeenCalledWith('ci', 'https://ci.com', 'CI');
  expect(log).toHaveBeenCalledWith(expect.stringContaining('ci'));
  log.mockRestore();
});

test('cmdBadgeAdd exits if missing args', () => {
  const err = jest.spyOn(console, 'error').mockImplementation(() => {});
  const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  expect(() => cmdBadgeAdd(['ci'])).toThrow('exit');
  err.mockRestore(); exit.mockRestore();
});

test('cmdBadgeRemove calls removeBadge', () => {
  mockRemove.mockReturnValue({ name: 'ci' });
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdBadgeRemove(['ci']);
  expect(mockRemove).toHaveBeenCalledWith('ci');
  log.mockRestore();
});

test('cmdBadgeList prints badges', () => {
  mockList.mockReturnValue([{ name: 'ci', label: 'CI', url: 'https://ci.com' }]);
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdBadgeList();
  expect(log).toHaveBeenCalled();
  log.mockRestore();
});

test('cmdBadgeList prints empty message', () => {
  mockList.mockReturnValue([]);
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdBadgeList();
  expect(log).toHaveBeenCalledWith('No badges saved.');
  log.mockRestore();
});

test('cmdBadgeShow prints badge json', () => {
  mockGet.mockReturnValue({ name: 'ci', url: 'https://ci.com', label: 'CI' });
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdBadgeShow(['ci']);
  expect(log).toHaveBeenCalled();
  log.mockRestore();
});
