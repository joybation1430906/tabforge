const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const BUILTIN_TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

const BUILTIN_TEMPLATES = {
  dev: {
    name: 'dev',
    description: 'Local development setup',
    tabs: [
      { url: 'http://localhost:3000', title: 'App' },
      { url: 'http://localhost:3000/api', title: 'API' },
      { url: 'https://github.com', title: 'GitHub' }
    ]
  },
  research: {
    name: 'research',
    description: 'Research session with common tools',
    tabs: [
      { url: 'https://google.com', title: 'Search' },
      { url: 'https://scholar.google.com', title: 'Scholar' },
      { url: 'https://wikipedia.org', title: 'Wikipedia' }
    ]
  },
  social: {
    name: 'social',
    description: 'Social media tabs',
    tabs: [
      { url: 'https://twitter.com', title: 'Twitter' },
      { url: 'https://reddit.com', title: 'Reddit' },
      { url: 'https://news.ycombinator.com', title: 'HN' }
    ]
  }
};

function listTemplates() {
  return Object.values(BUILTIN_TEMPLATES);
}

function getTemplate(name) {
  const builtin = BUILTIN_TEMPLATES[name];
  if (builtin) return builtin;
  return null;
}

function templateToYaml(template) {
  const config = {
    session: template.name,
    tabs: template.tabs
  };
  return yaml.dump(config);
}

function applyTemplate(name, overrides = {}) {
  const template = getTemplate(name);
  if (!template) {
    throw new Error(`Template "${name}" not found. Run 'tabforge template list' to see available templates.`);
  }
  return {
    ...template,
    ...overrides,
    tabs: overrides.tabs || template.tabs
  };
}

module.exports = { listTemplates, getTemplate, templateToYaml, applyTemplate };
