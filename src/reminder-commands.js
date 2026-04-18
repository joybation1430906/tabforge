const { addReminder, removeReminder, loadReminders, getDueReminders, toggleReminder } = require('./reminder');

function cmdReminderAdd(args) {
  const [name, url, message, remindAt] = args;
  if (!name || !url || !remindAt) {
    console.error('Usage: tabforge reminder add <name> <url> [message] <remindAt>');
    process.exit(1);
  }
  try {
    const r = addReminder(name, url, message || '', remindAt);
    console.log(`Reminder '${r.name}' added for ${r.remindAt}`);
  } catch (e) {
    console.error(e.message); process.exit(1);
  }
}

function cmdReminderRemove(args) {
  const [name] = args;
  if (!name) { console.error('Usage: tabforge reminder remove <name>'); process.exit(1); }
  try {
    removeReminder(name);
    console.log(`Reminder '${name}' removed`);
  } catch (e) {
    console.error(e.message); process.exit(1);
  }
}

function cmdReminderList() {
  const reminders = loadReminders();
  if (!reminders.length) { console.log('No reminders.'); return; }
  reminders.forEach(r => {
    const status = r.active ? 'active' : 'paused';
    console.log(`[${status}] ${r.name} — ${r.url} @ ${r.remindAt}${r.message ? ' | ' + r.message : ''}`);
  });
}

function cmdReminderDue() {
  const due = getDueReminders();
  if (!due.length) { console.log('No reminders due.'); return; }
  due.forEach(r => console.log(`DUE: ${r.name} — ${r.url}${r.message ? ' | ' + r.message : ''}`));
}

function cmdReminderToggle(args) {
  const [name] = args;
  if (!name) { console.error('Usage: tabforge reminder toggle <name>'); process.exit(1); }
  try {
    const r = toggleReminder(name);
    console.log(`Reminder '${name}' is now ${r.active ? 'active' : 'paused'}`);
  } catch (e) {
    console.error(e.message); process.exit(1);
  }
}

function handleReminderCommand(sub, args) {
  switch (sub) {
    case 'add': return cmdReminderAdd(args);
    case 'remove': return cmdReminderRemove(args);
    case 'list': return cmdReminderList();
    case 'due': return cmdReminderDue();
    case 'toggle': return cmdReminderToggle(args);
    default: console.error(`Unknown reminder command: ${sub}`); process.exit(1);
  }
}

module.exports = { cmdReminderAdd, cmdReminderRemove, cmdReminderList, cmdReminderDue, cmdReminderToggle, handleReminderCommand };
