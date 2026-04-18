const { addSchedule, removeSchedule, loadSchedules, getSchedule, toggleSchedule } = require('./schedule');

function cmdScheduleAdd(args) {
  const [name, sessionName, cron] = args;
  if (!name || !sessionName || !cron) {
    console.error('Usage: tabforge schedule add <name> <session> <cron>');
    process.exit(1);
  }
  try {
    const entry = addSchedule(name, sessionName, cron);
    console.log(`Schedule '${entry.name}' added for session '${entry.sessionName}' with cron '${entry.cron}'`);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

function cmdScheduleRemove(args) {
  const [name] = args;
  if (!name) { console.error('Usage: tabforge schedule remove <name>'); process.exit(1); }
  try {
    removeSchedule(name);
    console.log(`Schedule '${name}' removed`);
  } catch (e) {
    console.error(e.message); process.exit(1);
  }
}

function cmdScheduleList() {
  const schedules = loadSchedules();
  if (!schedules.length) { console.log('No schedules found.'); return; }
  schedules.forEach(s => {
    const status = s.enabled ? 'enabled' : 'disabled';
    console.log(`  ${s.name} -> ${s.sessionName} [${s.cron}] (${status})`);
  });
}

function cmdScheduleShow(args) {
  const [name] = args;
  if (!name) { console.error('Usage: tabforge schedule show <name>'); process.exit(1); }
  try {
    const s = getSchedule(name);
    console.log(JSON.stringify(s, null, 2));
  } catch (e) {
    console.error(e.message); process.exit(1);
  }
}

function cmdScheduleToggle(args) {
  const [name, state] = args;
  if (!name || !['on', 'off'].includes(state)) {
    console.error('Usage: tabforge schedule toggle <name> <on|off>'); process.exit(1);
  }
  try {
    const entry = toggleSchedule(name, state === 'on');
    console.log(`Schedule '${entry.name}' is now ${entry.enabled ? 'enabled' : 'disabled'}`);
  } catch (e) {
    console.error(e.message); process.exit(1);
  }
}

function handleScheduleCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdScheduleAdd(args);
    case 'remove': return cmdScheduleRemove(args);
    case 'list': return cmdScheduleList();
    case 'show': return cmdScheduleShow(args);
    case 'toggle': return cmdScheduleToggle(args);
    default: console.error(`Unknown schedule command: ${sub}`); process.exit(1);
  }
}

module.exports = { cmdScheduleAdd, cmdScheduleRemove, cmdScheduleList, cmdScheduleShow, cmdScheduleToggle, handleScheduleCommand };
