const { saveMacro, loadMacro, listMacros, deleteMacro, runMacro } = require('./macro');
const { openTab } = require('./launcher');

function cmdMacroSave(args) {
  const [name, ...steps] = args;
  if (!name || steps.length === 0) {
    console.log('Usage: tabforge macro save <name> <url1> [url2 ...]');
    return;
  }
  saveMacro(name, steps);
  console.log(`Macro '${name}' saved with ${steps.length} step(s).`);
}

function cmdMacroRun(args) {
  const [name] = args;
  if (!name) {
    console.log('Usage: tabforge macro run <name>');
    return;
  }
  try {
    const macro = runMacro(name, (url) => openTab(url));
    console.log(`Ran macro '${name}' — ${macro.steps.length} tab(s) opened.`);
  } catch (e) {
    console.log(e.message);
  }
}

function cmdMacroList() {
  const macros = listMacros();
  if (macros.length === 0) { console.log('No macros saved.'); return; }
  macros.forEach(m => console.log(`  - ${m}`));
}

function cmdMacroShow(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge macro show <name>'); return; }
  const macro = loadMacro(name);
  if (!macro) { console.log(`Macro '${name}' not found.`); return; }
  console.log(`Macro: ${macro.name}`);
  macro.steps.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
}

function cmdMacroDelete(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge macro delete <name>'); return; }
  const ok = deleteMacro(name);
  console.log(ok ? `Macro '${name}' deleted.` : `Macro '${name}' not found.`);
}

function handleMacroCommand(sub, args) {
  switch (sub) {
    case 'save': return cmdMacroSave(args);
    case 'run': return cmdMacroRun(args);
    case 'list': return cmdMacroList();
    case 'show': return cmdMacroShow(args);
    case 'delete': return cmdMacroDelete(args);
    default: console.log('Unknown macro subcommand: ' + sub);
  }
}

module.exports = { cmdMacroSave, cmdMacroRun, cmdMacroList, cmdMacroShow, cmdMacroDelete, handleMacroCommand };
