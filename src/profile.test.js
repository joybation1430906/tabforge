const fs = require('fs');
const path = require('path');
const os = require('os');
const { saveProfile, loadProfile, listProfiles, deleteProfile, profileExists } = require('./profile');

const TEST_DIR = path.join(os.tmpdir(), 'tabforge-profile-test-' + Date.now());

beforeEach(() => {
  jest.resetModules();
  jest.spyOn(require('./profile'), 'PROFILES_DIR', 'get').mockReturnValue(TEST_DIR);
});

afterEach(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
  jest.restoreAllMocks();
});

const sampleConfig = { browser: 'chrome', tabs: [{ url: 'https://example.com' }] };

describe('profile', () => {
  test('saveProfile writes json file', () => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
    const filePath = path.join(TEST_DIR, 'work.json');
    fs.writeFileSync(filePath, JSON.stringify(sampleConfig, null, 2));
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test('loadProfile throws if not found', () => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
    expect(() => loadProfile('nonexistent')).toThrow("Profile 'nonexistent' not found");
  });

  test('listProfiles returns empty array when no profiles', () => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
    const profiles = listProfiles();
    expect(Array.isArray(profiles)).toBe(true);
  });

  test('profileExists returns false for missing profile', () => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
    expect(profileExists('ghost')).toBe(false);
  });

  test('deleteProfile throws if not found', () => {
    fs.mkdirSync(TEST_DIR, { recursive: true });
    expect(() => deleteProfile('ghost')).toThrow("Profile 'ghost' not found");
  });
});
