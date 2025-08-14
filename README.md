# Decky Clipboard Plugin

A simple clipboard manager plugin for Steam Deck that allows you to save and manage frequently used text values.

## Features

- **Save Text Values**: Input and save text values for future use
- **Persistent Storage**: Values are saved to disk and persist across reboots
- **Copy to Clipboard**: One-click copying of saved values to system clipboard
- **Delete Values**: Remove unwanted values from your saved list
- **Simple Interface**: Clean, Steam Deck-optimized UI

## Usage

1. **Adding Values**: Enter text in the input field and click the "+" button or press Enter
2. **Copying Values**: Click the clipboard icon next to any saved value to copy it to your system clipboard
3. **Deleting Values**: Click the trash icon to remove a value from your saved list

## Installation

This plugin can be installed through the Decky Plugin Store or by building from source.

### Building from Source

1. Clone this repository
2. Install dependencies: `pnpm i`
3. Build the plugin: `pnpm run build`
4. Install the plugin to your Steam Deck

## Development

This plugin is built using the [decky-plugin-template](https://github.com/SteamDeckHomebrew/decky-plugin-template) and follows the standard Decky plugin development patterns.

### Dependencies

- Node.js v16.14+
- pnpm v9
- Python 3.x (for backend functionality)

### Backend

The plugin uses Python for backend functionality including:
- Persistent storage of clipboard values
- System clipboard integration via `xclip`
- JSON-based data storage

### Frontend

The frontend is built with React and TypeScript using the Decky UI library, providing a native Steam Deck experience.

## License

This project is licensed under the BSD-3-Clause License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built on the [decky-plugin-template](https://github.com/SteamDeckHomebrew/decky-plugin-template)
- Uses the [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) framework
