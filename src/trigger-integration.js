const { getTriggersForEvent } = require('./trigger');
const { loadSession } = require('./session');
const { openTab } = require('./launcher');

async function fireTrigger(event, context = {}) {
  const triggers = getTriggersForEvent(event);
  if (!triggers.length) return;

  for (const trigger of triggers) {
    try {
      await executeTriggerAction(trigger, context);
    } catch (e) {
      console.error(`Trigger '${trigger.name}' failed: ${e.message}`);
    }
  }
}

async function executeTriggerAction(trigger, context) {
  const { target } = trigger;

  // target can be a session name or a URL
  if (target.startsWith('http://') || target.startsWith('https://')) {
    await openTab(target, context.browser || 'default');
    return;
  }

  // treat as session name
  const session = loadSession(target);
  if (!session || !session.tabs) return;
  for (const tab of session.tabs) {
    await openTab(tab.url, context.browser || session.browser || 'default');
  }
}

module.exports = { fireTrigger, executeTriggerAction };
