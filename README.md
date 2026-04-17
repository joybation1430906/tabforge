# tabforge

A CLI tool to generate and manage browser tab sessions from YAML config files.

## Installation

```bash
npm install -g tabforge
```

## Usage

Create a YAML config file defining your tab session:

```yaml
# session.yaml
name: dev-session
browser: chrome
tabs:
  - url: https://github.com
  - url: https://localhost:3000
  - url: https://docs.example.com
```

Then run:

```bash
tabforge open session.yaml
```

### Commands

```bash
tabforge open <file>      # Launch a tab session from a config file
tabforge save <file>      # Save current browser tabs to a config file
tabforge list             # List all saved sessions
tabforge close <name>     # Close a named session
```

### Options

```bash
--browser, -b    Target browser (chrome, firefox, edge)
--dry-run        Preview tabs without opening them
--help           Show help information
```

## Example

```bash
# Preview a session before launching
tabforge open session.yaml --dry-run

# Save your current tabs as a session
tabforge save my-session.yaml --browser chrome
```

## License

MIT © tabforge contributors