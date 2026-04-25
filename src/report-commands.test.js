const { cmdReportGenerate, cmdReportList, cmdReportShow, cmdReportDelete, handleReportCommand } = require('./report-commands');

jest.mock('./report');
jest.mock('./history');
jest.mock('./session');

const report = require('./report');
const { loadHistory } = require('./history');
const { listSessions } = require('./session');

beforeEach(() => {
  jest.clearAllMocks();
  loadHistory.mockReturnValue([{ tags: ['dev'] }, { tags: ['work'] }]);
  listSessions.mockReturnValue(['s1', 's2']);
  report.buildReport.mockReturnValue({ name: 'r', totalLaunches: 2, totalSessions: 2, tagBreakdown: {} });
  report.saveReport.mockImplementation(() => {});
  report.loadReport.mockReturnValue(null);
  report.listReports.mockReturnValue([]);
  report.deleteReport.mockReturnValue(false);
});

test('cmdReportGenerate prints confirmation', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdReportGenerate(['weekly']);
  expect(report.saveReport).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('generated'));
  spy.mockRestore();
});

test('cmdReportGenerate warns on missing name', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdReportGenerate([]);
  expect(report.saveReport).not.toHaveBeenCalled();
  spy.mockRestore();
});

test('cmdReportList prints empty message', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdReportList();
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('No reports'));
  spy.mockRestore();
});

test('cmdReportList prints report names', () => {
  report.listReports.mockReturnValue(['weekly', 'monthly']);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdReportList();
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('weekly'));
  spy.mockRestore();
});

test('cmdReportShow prints not found', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdReportShow(['x']);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('not found'));
  spy.mockRestore();
});

test('cmdReportDelete prints deleted', () => {
  report.deleteReport.mockReturnValue(true);
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  cmdReportDelete(['old']);
  expect(spy).toHaveBeenCalledWith(expect.stringContaining('deleted'));
  spy.mockRestore();
});

test('handleReportCommand routes correctly', () => {
  const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
  handleReportCommand('list', []);
  expect(report.listReports).toHaveBeenCalled();
  spy.mockRestore();
});
