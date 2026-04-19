const { saveTheme, loadTheme, listThemes, deleteTheme } = require('./theme');

function cmdThemeSave(args) {
  const [name, ...rest] = args;
  if (!name) return console.error('Usage: tabforge theme save <name> --colors <hex,...>');
  const colorsIdx = rest.indexOf('--colors');
  const colors = colorsIdx !== -1 ? rest[colorsIdx + 1].split(',') : [];
  saveTheme(name, { name, colors, createdAt: new Date().toISOString() });
  console.log(`Theme '${name}' saved.`);
}

function cmdThemeList() {
  const themes = listThemes();
  if (!themes.length) return console.log('No themes saved.');
  themes.forEach(t => console.log(` - ${t}`));
}

function cmdThemeShow(args) {
  const [name] = args;
  if (!name) return console.error('Usage: tabforge theme show <name>');
  const theme = loadTheme(name);
  if (!theme) return console.error(`Theme '${name}' not found.`);
  console.log(JSON.stringify(theme, null, 2));
}

function cmdThemeDelete(args) {
  const [name] = args;
  if (!name) return console.error('Usage: tabforge theme delete <name>');
  const deleted = deleteTheme(name);
  console.log(deleted ? `Theme '${name}' deleted.` : `Theme '${name}' not found.`);
}

function handleThemeCommand(sub, args) {
  switch (sub) {
    case 'save': return cmdThemeSave(args);
    case 'list': return cmdThemeList();
    case 'show': return cmdThemeShow(args);
    case 'delete': return cmdThemeDelete(args);
    default: console.error(`Unknown theme subcommand: ${sub}`);
  }
}

module.exports = { cmdThemeSave, cmdThemeList, cmdThemeShow, cmdThemeDelete, handleThemeCommand };
