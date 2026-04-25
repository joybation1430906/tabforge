const { buildReport, saveReport, loadReport, listReports, deleteReport } = require('./report');
const { loadHistory } = require('./history');
const { listSessions } = require('./session');

function cmdReportGenerate(args) {
  const name = args[0];
  if (!name) return console.log('Usage: report generate <name>');
  const history = loadHistory();
  const sessions = listSessions();
  const tags = history.flatMap(h => h.tags || []);
  const report = buildReport(name, { history, sessions, tags });
  saveReport(name, report);
  console.log(`Report '${name}' generated.`);
  console.log(`  Total launches : ${report.totalLaunches}`);
  console.log(`  Total sessions : ${report.totalSessions}`);
}

function cmdReportList() {
  const reports = listReports();
  if (!reports.length) return console.log('No reports found.');
  reports.forEach(r => console.log(`  - ${r}`));
}

function cmdReportShow(args) {
  const name = args[0];
  if (!name) return console.log('Usage: report show <name>');
  const report = loadReport(name);
  if (!report) return console.log(`Report '${name}' not found.`);
  console.log(JSON.stringify(report, null, 2));
}

function cmdReportDelete(args) {
  const name = args[0];
  if (!name) return console.log('Usage: report delete <name>');
  const ok = deleteReport(name);
  console.log(ok ? `Report '${name}' deleted.` : `Report '${name}' not found.`);
}

function handleReportCommand(sub, args) {
  switch (sub) {
    case 'generate': return cmdReportGenerate(args);
    case 'list':     return cmdReportList();
    case 'show':     return cmdReportShow(args);
    case 'delete':   return cmdReportDelete(args);
    default:
      console.log('Usage: tabforge report <generate|list|show|delete> [name]');
  }
}

module.exports = {
  cmdReportGenerate,
  cmdReportList,
  cmdReportShow,
  cmdReportDelete,
  handleReportCommand,
};
