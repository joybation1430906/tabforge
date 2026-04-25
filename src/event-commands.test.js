jest.mock('./event');
const event = require('./event');
const { cmdEventCreate, cmdEventList, cmdEventShow, cmdEventDelete, cmdEventRename, handleEventCommand } = require('./event-commands');

beforeEach(() => jest.clearAllMocks());

describe('cmdEventCreate', () => {
  test('creates event with url', () => {
    cmdEventCreate(['standup', '--url', 'https://meet.example.com']);
    expect(event.saveEvent).toHaveBeenCalledWith('standup', expect.objectContaining({ name: 'standup', url: 'https://meet.example.com' }));
  });

  test('prints usage if no name', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    cmdEventCreate([]);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Usage'));
    spy.mockRestore();
  });
});

describe('cmdEventList', () => {
  test('lists events', () => {
    event.listEvents.mockReturnValue(['alpha', 'beta']);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    cmdEventList();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('alpha'));
    spy.mockRestore();
  });

  test('shows message when empty', () => {
    event.listEvents.mockReturnValue([]);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    cmdEventList();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('No events'));
    spy.mockRestore();
  });
});

describe('cmdEventShow', () => {
  test('shows event', () => {
    event.loadEvent.mockReturnValue({ name: 'standup', url: 'https://x.com' });
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    cmdEventShow(['standup']);
    expect(event.loadEvent).toHaveBeenCalledWith('standup');
    spy.mockRestore();
  });

  test('handles missing event', () => {
    event.loadEvent.mockReturnValue(null);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    cmdEventShow(['ghost']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('not found'));
    spy.mockRestore();
  });
});

describe('handleEventCommand', () => {
  test('routes unknown subcommand', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleEventCommand('bogus', []);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Unknown'));
    spy.mockRestore();
  });
});
