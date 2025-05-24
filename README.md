# @telosh/filetree

A command-line tool to display the file tree of a specified directory.

[![npm version](https://badge.fury.io/js/%40telosh%2Ffiletree.svg)](https://badge.fury.io/js/%40telosh%2Ffiletree)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Display directory structure in a tree format
- Customizable depth level
- File and directory icons support
- File metadata display (size, last modified date)
- Gitignore integration
- Markdown output support
- Customizable exclusions
- Size unit conversion

## Installation

Install the package globally using npm:

```bash
npm install -g @telosh/filetree
```

## Usage

```bash
filetree [dirPath] [options]
```

- `dirPath`: The directory path to display the tree structure for. Defaults to the current directory (`.`).

## Options

| Option                | Alias | Description                                                              | Default                   |
|-----------------------|-------|--------------------------------------------------------------------------|---------------------------|
| `--level <depth>`     | `-L`  | Descend only `<depth>` levels in the directory tree.                      | `Infinity`                |
| `--output <filepath>` | `-o`  | Write output to a file in Markdown format.                                | Output to console         |
| `--exclude <dirs>`    | `-e`  | Comma-separated list of directory names to exclude.                       | `node_modules,.git`       |
| `--icons`               | `-i`    | Display icons for files and directories.                                   | Off                       |
| `--metadata`            | `-m`  | Display file metadata (size, last modified date).                        | Off                       |
| `--size-only`         |       | Display only file size in metadata (requires `--metadata`).              | Off                       |
| `--size-unit <unit>`  |       | Specify size unit for metadata (B, KB, MB, GB).                            | `B`                       |
| `--use-gitignore`     |       | Automatically exclude files and directories found in `.gitignore`.         | Off                       |
| `--version`           |       | Display the version number.                                              |                           |
| `--help`              |       | Display help for the command.                                            |                           |

## Examples

1.  **Display the tree structure of the current directory:**

    ```bash
    filetree
    ```

2.  **Display the tree structure of a specific directory (e.g., `src`):**

    ```bash
    filetree src
    ```

3.  **Display the tree structure up to 2 levels deep:**

    ```bash
    filetree -L 2
    ```

4.  **Exclude `node_modules` and `dist` directories:**

    ```bash
    filetree -e node_modules,dist
    ```

5.  **Save the output to a Markdown file (e.g., `tree.md`):**

    ```bash
    filetree -o tree.md
    ```

6.  **Display the tree structure with icons:**

    ```bash
    filetree -i
    ```

7.  **Display the tree structure with metadata (size and last modified date):**

    ```bash
    filetree -m
    ```

8.  **Display the tree structure with only file sizes in KB:**

    ```bash
    filetree -m --size-only --size-unit KB
    ```

9.  **Display the tree structure, excluding files and directories from `.gitignore`:**

    ```bash
    filetree --use-gitignore
    ```

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/telosh/fileTree.git
cd fileTree
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

### Testing

Run tests:
```bash
npm test
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Version History

- 1.0.0
  - Initial stable release
  - Complete feature set
  - Improved error handling
  - Full documentation

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
