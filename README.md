# @telosh/filetree

A command-line tool to display the file tree of a specified directory.

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

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
