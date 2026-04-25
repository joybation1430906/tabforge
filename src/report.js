const fs = require('fs');
const path = require('path');
const os = require('os');

const REPORTS_DIR = path.join(os.homedir(), '.tabforge', 'reports');

function ensureReportsDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

function getReportPath(name) {
  return path.join(REPORTS_DIR, `${name}.json`);
}

function saveReport(name, data) {
  ensureReportsDir();
  fs.writeFileSync(getReportPath(name), JSON.stringify(data, null, 2));
}

function loadReport(name) {
  const p = getReportPath(name);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function listReports() {
  ensureReportsDir();
  return fs.readdirSync(REPORTS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
}

function deleteReport(name) {
  const p = getReportPath(name);
  if (!fs.existsSync(p)) return false;
  fs.unlinkSync(p);
  return true;
}

function buildReport(name, { history, sessions, tags } = {}) {
  const report = {
    name,
    createdAt: new Date().toISOString(),
    totalLaunches: history ? history.length : 0,
    totalSessions: sessions ? sessions.length : 0,
    tagBreakdown: {},
  };
  if (tags && Array.isArray(tags)) {
    tags.forEach(t => {
      report.tagBreakdown[t] = (report.tagBreakdown[t] || 0) + 1;
    });
  }
  return report;
}

module.exports = {
  ensureReportsDir,
  getReportPath,
  saveReport,
  loadReport,
  listReports,
  deleteReport,
  buildReport,
};
