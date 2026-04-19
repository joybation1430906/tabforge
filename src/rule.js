const fs = require('fs');
const path = require('path');
const os = require('os');

const RULES_FILE = path.join(os.homedir(), '.tabforge', 'rules.json');

function ensureRulesFile() {
  const dir = path.dirname(RULES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(RULES_FILE)) fs.writeFileSync(RULES_FILE, JSON.stringify([]));
}

function loadRules() {
  ensureRulesFile();
  return JSON.parse(fs.readFileSync(RULES_FILE, 'utf8'));
}

function saveRules(rules) {
  ensureRulesFile();
  fs.writeFileSync(RULES_FILE, JSON.stringify(rules, null, 2));
}

function addRule(name, condition, action) {
  const rules = loadRules();
  if (rules.find(r => r.name === name)) throw new Error(`Rule '${name}' already exists`);
  const rule = { name, condition, action, enabled: true, createdAt: new Date().toISOString() };
  rules.push(rule);
  saveRules(rules);
  return rule;
}

function removeRule(name) {
  const rules = loadRules();
  const idx = rules.findIndex(r => r.name === name);
  if (idx === -1) throw new Error(`Rule '${name}' not found`);
  const [removed] = rules.splice(idx, 1);
  saveRules(rules);
  return removed;
}

function getRule(name) {
  const rules = loadRules();
  const rule = rules.find(r => r.name === name);
  if (!rule) throw new Error(`Rule '${name}' not found`);
  return rule;
}

function toggleRule(name) {
  const rules = loadRules();
  const rule = rules.find(r => r.name === name);
  if (!rule) throw new Error(`Rule '${name}' not found`);
  rule.enabled = !rule.enabled;
  saveRules(rules);
  return rule;
}

function applyRules(tabs) {
  const rules = loadRules().filter(r => r.enabled);
  return tabs.map(tab => {
    for (const rule of rules) {
      if (tab.url && tab.url.includes(rule.condition)) {
        tab = { ...tab, ...rule.action };
      }
    }
    return tab;
  });
}

module.exports = { ensureRulesFile, loadRules, saveRules, addRule, removeRule, getRule, toggleRule, applyRules };
