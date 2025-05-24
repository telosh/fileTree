# Release Notes for @telosh/filetree v1.0.0

## Overview
This is the first stable release of @telosh/filetree, a command-line tool for displaying directory structures in a tree format. The tool provides a rich set of features for visualizing file hierarchies with customizable options.

## New Features
- **Core Functionality**
  - Display directory structure in a tree format
  - Support for unlimited directory depth
  - Customizable depth level control
  - File and directory exclusion

- **Visual Enhancements**
  - File and directory icons
  - Customizable tree characters
  - Color support (coming in future versions)

- **Metadata Display**
  - File size information
  - Last modified date
  - Customizable size units (B, KB, MB, GB)
  - Option to show only size information

- **Output Options**
  - Console output
  - Markdown file output
  - Customizable output format

- **Integration Features**
  - Gitignore support
  - Custom exclusion patterns
  - Hidden file handling

## Technical Improvements
- **Code Quality**
  - Comprehensive test suite
  - TypeScript type safety
  - ESLint and Prettier integration
  - Code coverage monitoring

- **Development Experience**
  - GitHub Actions CI/CD pipeline
  - Automated testing
  - Code quality checks
  - Development documentation

- **Documentation**
  - API documentation
  - Usage examples
  - Troubleshooting guide
  - Contributing guidelines

## Breaking Changes
None. This is the first stable release.

## Known Issues
- Performance may be affected when processing very large directories
- Some terminal emulators may not display icons correctly

## Future Plans
- Performance optimization for large directories
- Additional file type icons
- Color support
- Custom tree character sets
- JSON output format
- Interactive mode

## Installation
```bash
npm install -g @telosh/filetree
```

## Usage
```bash
filetree [dirPath] [options]
```

For detailed usage instructions, please refer to the [README.md](README.md) file.

## Support
For bug reports and feature requests, please visit our [GitHub Issues](https://github.com/telosh/fileTree/issues) page.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. 