const { cmdMilestoneSave, cmdMilestoneList, cmdMilestoneShow, cmdMilestoneDelete, cmdMilestoneRename, handleMilestoneCommand } = require('./milestone-commands');

let logs;
beforeEach(() => {
  logs = [];
  jest.spyOn(console, 'log').mockImplementation((...a) => logs.push(a.join(' ')));
  jest.resetModules();
});
afterEach(() => jest.restoreAllMocks());

const mockMod = () => ({
  saveMilestone: jest.fn((n, d) => ({ name: n, createdAt: '2024-01-01', ...d })),
  loadMilestone: jest.fn(n => n === 'v1' ? { name: 'v1', description: 'hi', createdAt: '2024-01-01' } : null),
  listMilestones: jest.fn(() => ['v1', 'v2']),
  deleteMilestone: jest.fn(n => n === 'v1'),
  renameMilestone: jest.fn((o, n) => o === 'v1')
});

test('cmdMilestoneSave prints confirmation', () => {
  jest.doMock('./milestone', mockMod);
  const { cmdMilestoneSave: fn } = require('./milestone-commands');
  fn(['v1', 'First', 'release']);
  expect(logs[0]).toMatch(/saved/);
});

test('cmdMilestoneSave without name prints usage', () => {
  jest.doMock('./milestone', mockMod);
  const { cmdMilestoneSave: fn } = require('./milestone-commands');
  fn([]);
  expect(logs[0]).toMatch(/Usage/);
});

test('cmdMilestoneList prints names', () => {
  jest.doMock('./milestone', mockMod);
  const { cmdMilestoneList: fn } = require('./milestone-commands');
  fn();
  expect(logs.some(l => l.includes('v1'))).toBe(true);
});

test('cmdMilestoneShow prints json', () => {
  jest.doMock('./milestone', mockMod);
  const { cmdMilestoneShow: fn } = require('./milestone-commands');
  fn(['v1']);
  expect(logs.join('')).toContain('v1');
});

test('cmdMilestoneShow not found', () => {
  jest.doMock('./milestone', mockMod);
  const { cmdMilestoneShow: fn } = require('./milestone-commands');
  fn(['missing']);
  expect(logs[0]).toMatch(/not found/);
});

test('cmdMilestoneDelete success', () => {
  jest.doMock('./milestone', mockMod);
  const { cmdMilestoneDelete: fn } = require('./milestone-commands');
  fn(['v1']);
  expect(logs[0]).toMatch(/deleted/);
});

test('handleMilestoneCommand unknown sub', () => {
  handleMilestoneCommand('bogus', []);
  expect(logs[0]).toMatch(/Unknown/);
});
