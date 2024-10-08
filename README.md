# Confluence Space Sync Plugin for Obsidian

[![Version](https://img.shields.io/github/v/release/pwnyprod/obsidian-confluence-space-sync-plugin)](https://github.com/pwnyprod/confluence-space-sync-plugin/releases)
[![License](https://img.shields.io/github/license/pwnyprod/obsidian-confluence-space-sync-plugin)](LICENSE.md)

Confluence Space Sync is an Obsidian plugin that allows you to synchronize entire Confluence spaces into your Obsidian vault. This plugin is ideal for teams or individuals who want to keep a local backup of Confluence pages in Markdown format or seamlessly integrate Confluence knowledge bases into their Obsidian workflow.

> [!] NOTE
>
> Currently not all Confluence Elements are converted to the right Markdown elements.
> Feel free to add missing elements or fix/enhance modules

## Features

- **Sync entire Confluence spaces**: Automatically fetches all pages in a given Confluence space and syncs them as Markdown files.
- **Folder structure mirroring**: The Confluence hierarchy is mirrored as folders within Obsidian.
- **Automatic sync**: Set intervals for the plugin to sync Confluence with Obsidian automatically.
- **Markdown conversion**: Converts HTML from Confluence pages into Markdown using customizable plugins.
- **Handles Confluence-specific elements**: The plugin includes custom handlers for elements like tables, task lists, panels, and macros.

## Getting Started

### Installation

1. Download the latest version from the [Releases](https://github.com/pwnyprod/confluence-space-sync-plugin/releases) page.
2. Copy the plugin files to your Obsidian vault's `/.obsidian/plugins/confluence-space-sync` folder.
3. In Obsidian, go to `Settings -> Community plugins -> Installed plugins` and enable the Confluence Folder Sync plugin.
4. Configure the plugin in `Settings -> Confluence Sync`, where you can add your Confluence base URL, API token, and the spaces you wish to sync.

### Requirements

- A valid Confluence API token.
- Obsidian version 0.12.0 or higher.

### Configuration

In the plugin settings, you will need to specify:

1. **Confluence Base URL**: The base URL for your Confluence instance.
2. **API Token**: A Confluence API token for authentication.
3. **Username**: The email address or username associated with your Confluence account.
4. **Sync Interval**: Set how frequently (in minutes) the plugin should sync your spaces.
5. **Spaces to Sync**: Add multiple spaces by specifying the Confluence space key and the corresponding Obsidian folder for storage.

## Usage

1. Once set up, the plugin will automatically synchronize the selected Confluence spaces to your Obsidian vault at the defined intervals.
2. You can also manually trigger a sync by disabling and re-enabling the plugin.

## For Developers

We welcome contributions from the community. Here’s how to get started if you'd like to collaborate:

### Project Structure

```
├── src
│   ├── definition          # Contains type definitions and interfaces.
│   ├── modules             # Core logic for API, file management, and sync operations.
│   ├── plugins             # Turndown plugins for converting HTML to Markdown.
│   └── main.ts             # Plugin entry point and lifecycle management.
├── settings.ts             # Plugin settings structure and default values.
├── settingsTab.ts          # UI elements for the settings interface in Obsidian.
├── rollup.config.js        # Build configuration for bundling the plugin.
└── tsconfig.json           # TypeScript configuration.
```

### How It Works

- **API Client**: The plugin interacts with the Confluence API to fetch spaces, pages, and their content. It supports pagination and various Confluence endpoints.
- **File Management**: The plugin manages the saving and updating of Markdown files in the Obsidian vault, ensuring that the folder structure mirrors the Confluence space structure.
- **Markdown Conversion**: Custom plugins process Confluence-specific HTML elements (e.g., task lists, tables, and panels) and convert them into appropriate Markdown syntax.

### Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit them (`git commit -m "Added feature"`).
4. Push your branch (`git push origin feature-name`).
5. Open a pull request.

### Development Setup

To work on this plugin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Obsidian](https://obsidian.md/)

To get started:

1. Clone the repository:
```bash
git clone https://github.com/pwnyprod/confluence-space-sync-plugin.git
cd confluence-space-sync-plugin
```
2.	Install dependencies:
```bash
yarn install
```
3.	Run the development server:
```bash
yarn dev
```
4.	Build the plugin:
```bash
yarn build
```

### SOLID Principles

The project follows the [SOLID design principles](https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design) for maintainability and scalability. Each module and plugin is built with separation of concerns in mind. Contributions should adhere to these guidelines.

### Known Issues

- Tables: Some complex Confluence tables may not be converted perfectly to Markdown.
- Macros: Not all Confluence macros are supported yet. Support for more macros is planned.

## License

This project is licensed under the [MIT License](LICENSE.md).

If you have any questions, feel free to open an issue or contribute to the project!