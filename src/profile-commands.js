const { saveProfile, loadProfile, listProfiles, deleteProfile, profileExists } = require('./profile');
const { parseSessionConfig } = require('./parser');
const { templateToYaml } = require('./template');
const fs = require('fs');

function cmdProfileSave(name, yamlPath) {
  if (!name || !yamlPath) {
    console.error('Usage: tabforge profile save <name> <file.yaml>');
    process.exit(1);
  }
  if (!fs.existsSync(yamlPath)) {
    console.error(`File not found: ${yamlPath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(yamlPath, 'utf8');
  const config = parseSessionConfig(raw);
  saveProfile(name, config);
  console.log(`Profile '${name}' saved.`);
}

function cmdProfileList() {
  const profiles = listProfiles();
  if (profiles.length === 0) {
    console.log('No profiles saved.');
    return;
  }
  console.log('Saved profiles:');
  profiles.forEach(p => console.log(`  - ${p}`));
}

function cmdProfileShow(name) {
  if (!name) {
    console.error('Usage: tabforge profile show <name>');
    process.exit(1);
  }
  const config = loadProfile(name);
  console.log(templateToYaml(config));
}

function cmdProfileDelete(name) {
  if (!name) {
    console.error('Usage: tabforge profile delete <name>');
    process.exit(1);
  }
  deleteProfile(name);
  console.log(`Profile '${name}' deleted.`);
}

module.exports = { cmdProfileSave, cmdProfileList, cmdProfileShow, cmdProfileDelete };
