const { savePreset, loadPreset, listPresets, deletePreset, renamePreset } = require('./preset');

function cmdPresetSave(args) {
  const [name, ...urlParts] = args;
  if (!name || urlParts.length === 0) {
    console.log('Usage: tabforge preset save <name> <url1> [url2...]');
    return;
  }
  const data = { name, urls: urlParts, createdAt: new Date().toISOString() };
  savePreset(name, data);
  console.log(`Preset '${name}' saved with ${urlParts.length} URL(s).`);
}

function cmdPresetList() {
  const presets = listPresets();
  if (presets.length === 0) { console.log('No presets saved.'); return; }
  presets.forEach(p => console.log(`  - ${p}`));
}

function cmdPresetShow(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge preset show <name>'); return; }
  const data = loadPreset(name);
  if (!data) { console.log(`Preset '${name}' not found.`); return; }
  console.log(`Preset: ${data.name}`);
  console.log(`Created: ${data.createdAt}`);
  data.urls.forEach((u, i) => console.log(`  ${i + 1}. ${u}`));
}

function cmdPresetDelete(args) {
  const [name] = args;
  if (!name) { console.log('Usage: tabforge preset delete <name>'); return; }
  const ok = deletePreset(name);
  console.log(ok ? `Preset '${name}' deleted.` : `Preset '${name}' not found.`);
}

function cmdPresetRename(args) {
  const [oldName, newName] = args;
  if (!oldName || !newName) { console.log('Usage: tabforge preset rename <old> <new>'); return; }
  const ok = renamePreset(oldName, newName);
  console.log(ok ? `Preset renamed to '${newName}'.` : `Preset '${oldName}' not found.`);
}

function handlePresetCommand(args) {
  const [sub, ...rest] = args;
  switch (sub) {
    case 'save': return cmdPresetSave(rest);
    case 'list': return cmdPresetList();
    case 'show': return cmdPresetShow(rest);
    case 'delete': return cmdPresetDelete(rest);
    case 'rename': return cmdPresetRename(rest);
    default: console.log('Unknown preset command. Use: save, list, show, delete, rename');
  }
}

module.exports = { cmdPresetSave, cmdPresetList, cmdPresetShow, cmdPresetDelete, cmdPresetRename, handlePresetCommand };
