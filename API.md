# API Documentation

## TreeGenerator

The main class for generating file tree structures.

### Constructor

```typescript
constructor(options: TreeOptions)
```

#### Parameters

- `options`: Configuration options for tree generation
  - `level`: Maximum depth level (default: Infinity)
  - `exclude`: Array of directory names to exclude (default: ['node_modules', '.git'])
  - `icons`: Whether to display icons (default: false)
  - `metadata`: Whether to display file metadata (default: false)
  - `sizeOnly`: Whether to display only file size in metadata (default: false)
  - `sizeUnit`: Size unit for metadata (default: 'B')
  - `useGitignore`: Whether to use .gitignore for exclusions (default: false)

### Methods

#### generate(dirPath: string): string

Generates a tree structure for the specified directory.

##### Parameters

- `dirPath`: Path to the directory to generate tree for

##### Returns

- `string`: Generated tree structure

## FileWriter

Utility class for writing tree output to files.

### Methods

#### writeToFile(content: string, filePath: string): void

Writes the tree content to a file.

##### Parameters

- `content`: Tree content to write
- `filePath`: Path to the output file

##### Throws

- `Error`: If file writing fails

## Formatters

Utility functions for formatting file metadata.

### Functions

#### formatSize(size: number, unit: string): string

Formats file size with the specified unit.

##### Parameters

- `size`: File size in bytes
- `unit`: Size unit ('B', 'KB', 'MB', 'GB')

##### Returns

- `string`: Formatted size string

#### formatDate(date: Date): string

Formats file modification date.

##### Parameters

- `date`: Date to format

##### Returns

- `string`: Formatted date string

## Error Handling

The library provides comprehensive error handling for common scenarios:

- Invalid directory paths
- Permission errors
- File system errors
- Invalid options

All errors include descriptive messages and proper error types for easy handling. 