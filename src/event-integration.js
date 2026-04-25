const { loadEvent, listEvents } = require('./event');
const { openTab } = require('./launcher');
const { loadSession } = require('./session');

function triggerEvent(name) {
  const event = loadEvent(name);
  if (!event) {
    console.log(`Event '${name}' not found.`);
    return false;
  }
  if (event.url) {
    openTab(event.url);
    console.log(`Opened URL: ${event.url}`);
  }
  if (event.session) {
    const session = loadSession(event.session);
    if (session && session.tabs) {
      session.tabs.forEach(tab => openTab(tab.url));
      console.log(`Launched session '${event.session}' (${session.tabs.length} tabs).`);
    } else {
      console.log(`Session '${event.session}' not found or empty.`);
    }
  }
  return true;
}

function handleEventIntegration(sub, args) {
  if (sub === 'trigger') {
    const [name] = args;
    if (!name) { console.log('Usage: tabforge event trigger <name>'); return; }
    triggerEvent(name);
  }
}

module.exports = { triggerEvent, handleEventIntegration };
