const { cmdProfileList, cmdProfileShow, cmdProfileDelete } = require('./profile-commands');
const profile = require('./profile');

beforeEach(() => jest.spyOn(console, 'log').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

describe('cmdProfileList', () => {
  test('prints no profiles message when empty', () => {
    jest.spyOn(profile, 'listProfiles').mockReturnValue([]);
    cmdProfileList();
    expect(console.log).toHaveBeenCalledWith('No profiles saved.');
  });

  test('lists profiles', () => {
    jest.spyOn(profile, 'listProfiles').mockReturnValue(['work', 'personal']);
    cmdProfileList();
    expect(console.log).toHaveBeenCalledWith('Saved profiles:');
    expect(console.log).toHaveBeenCalledWith('  - work');
    expect(console.log).toHaveBeenCalledWith('  - personal');
  });
});

describe('cmdProfileDelete', () => {
  test('calls deleteProfile and logs success', () => {
    const del = jest.spyOn(profile, 'deleteProfile').mockImplementation(() => {});
    cmdProfileDelete('work');
    expect(del).toHaveBeenCalledWith('work');
    expect(console.log).toHaveBeenCalledWith("Profile 'work' deleted.");
  });

  test('exits if no name provided', () => {
    const exit = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => cmdProfileDelete()).toThrow('exit');
    expect(exit).toHaveBeenCalledWith(1);
  });
});
