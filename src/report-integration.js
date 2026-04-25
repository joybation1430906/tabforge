const { buildReport, saveReport } = require('./report');
const { loadHistory } = require('./history');
const { listSessions } = require('./session');

/**
 * Auto-generate a report after a session launch.
 * Saves a snapshot named by ISO date so users can track usage over time.
 */
function autoReport(label) {
  try {
    const history = loadHistory();
    const sessions = listSessions();
    const tags = history.flatMap(h => h.tags || []);
    const name = label || `auto-${new Date().toISOString().slice(0, 10)}`;
    const report = buildReport(name, { history, sessions, tags });
    saveReport(name, report);
    return report;
  } catch (err) {
    // non-fatal — reporting should never break a launch
    return null;
  }
}

/**
 * Called from index.js after a successful launch to record telemetry.
 */
function handleReportIntegration(sessionName) {
  return autoReport(sessionName ? `launch-${sessionName}` : undefined);
}

module.exports = { autoReport, handleReportIntegration };
