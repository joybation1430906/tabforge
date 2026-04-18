const { exec } = require('child_process');
const os = require('os');

const BROWSER_COMMANDS = {
  darwin: {
    chrome: 'open -a "Google Chrome"',
    firefox: 'open -a Firefox',
    safari: 'open -a Safari',
    default: 'open'
  },
  linux: {
    chrome: 'google-chrome',
    firefox: 'firefox',
    default: 'xdg-open'
  },
  win32: {
    chrome: 'start chrome',
    firefox: 'start firefox',
    default: 'start'
  }
};

function getBrowserCommand(browser) {
  const platform = os.platform();
  const commands = BROWSER_COMMANDS[platform] || BROWSER_COMMANDS.linux;
  return commands[browser] || commands.default;
}

function openTab(url, browser = 'default') {
  return new Promise((resolve, reject) => {
    if (!url || typeof url !== 'string') {
      return reject(new Error('Invalid URL: must be a non-empty string'));
    }
    const cmd = `${getBrowserCommand(browser)} "${url}"`;
    exec(cmd, (error) => {
      if (error) {
        reject(new Error(`Failed to open ${url}: ${error.message}`));
      } else {
        resolve(url);
      }
    });
  });
}

async function launchSession(session, options = {}) {
  const { browser = 'default', delay = 200 } = options;
  const results = { opened: [], failed: [] };

  for (const tab of session.tabs) {
    try {
      await openTab(tab.url, tab.browser || browser);
      results.opened.push(tab.url);
      if (delay > 0) {
        await new Promise((r) => setTimeout(r, delay));
      }
    } catch (err) {
      results.failed.push({ url: tab.url, error: err.message });
    }
  }

  return results;
}

module.exports = { openTab, launchSession, getBrowserCommand };
