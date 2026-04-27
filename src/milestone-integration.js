const { saveMilestone, loadMilestone, listMilestones } = require('./milestone');

/**
 * Auto-milestone: save a milestone when a session is launched
 * if it matches a significant event (e.g. 10th launch).
 */
function autoMilestone(sessionName, launchCount) {
  const thresholds = [10, 25, 50, 100, 250, 500];
  if (!thresholds.includes(launchCount)) return null;
  const name = `${sessionName}-launch-${launchCount}`;
  const existing = loadMilestone(name);
  if (existing) return existing;
  return saveMilestone(name, {
    description: `Session '${sessionName}' launched ${launchCount} times`,
    session: sessionName,
    launchCount
  });
}

/**
 * Get all milestones associated with a given session name.
 */
function getMilestonesForSession(sessionName) {
  return listMilestones()
    .map(n => loadMilestone(n))
    .filter(m => m && m.session === sessionName);
}

function handleMilestoneIntegration(action, payload) {
  if (action === 'auto') {
    return autoMilestone(payload.sessionName, payload.launchCount);
  }
  if (action === 'forSession') {
    return getMilestonesForSession(payload.sessionName);
  }
  return null;
}

module.exports = { autoMilestone, getMilestonesForSession, handleMilestoneIntegration };
