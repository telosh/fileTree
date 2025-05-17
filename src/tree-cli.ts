#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { Command, OptionValues } from 'commander';

interface ProgramOptions extends OptionValues {
  level?: string;
  output?: string;
  exclude?: string;
  icons?: boolean;
  metadata?: boolean;
  sizeOnly?: boolean;
  sizeUnit?: string;
  useGitignore?: boolean;
}

interface TreeOptions {
  showHidden?: boolean;
  exclude: string[]; // Made exclude non-optional as it always has a default
  showIcons: boolean; // Made showIcons non-optional
  showMetadata: boolean;
  showSizeOnly: boolean;
  sizeDisplayUnit: string;
  applyGitignore: boolean;
}

const program = new Command();

program
  .version('0.1.0')
  .argument('[dirPath]', 'Directory path to display tree structure', '.')
  .option('-L, --level <depth>', 'Descend only <depth> levels in the directory tree.')
  .option('-o, --output <filepath>', 'Write output to a file in Markdown format.')
  .option('-e, --exclude <dirs>', 'Comma-separated list of directory names to exclude.')
  .option('-i, --icons', 'Display icons for files and directories.')
  .option('-m, --metadata', 'Display file metadata (size, last modified date).')
  .option('--size-only', 'Display only file size in metadata.')
  .option('--size-unit <unit>', 'Specify size unit (B, KB, MB, GB). Default: B', 'B')
  .option('--use-gitignore', 'Automatically exclude files and directories found in .gitignore.')
  .action((dirPath: string, options: ProgramOptions) => {
    const targetDirectory = path.resolve(dirPath);
    const maxDepth = options.level ? parseInt(options.level, 10) : Infinity;
    const outputFile = options.output ? path.resolve(options.output) : undefined;
    // Default excludes are now more clearly defined
    let excludeDirs = options.exclude ? options.exclude.split(',').map(dir => dir.trim()) : ['node_modules', '.git'];
    const showIcons = !!options.icons;
    const showMetadata = !!options.metadata;
    const showSizeOnly = !!options.sizeOnly;
    const sizeUnit = options.sizeUnit ? options.sizeUnit.toUpperCase() : 'B';
    const useGitignore = !!options.useGitignore;

    if (useGitignore) {
      const gitignorePath = path.join(targetDirectory, '.gitignore');
      try {
        if (fs.existsSync(gitignorePath)) {
          const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
          const gitignorePatterns = gitignoreContent.split(/\r?\n/).filter(line => line.trim() !== '' && !line.startsWith('#'));
          // Basic pattern handling: remove trailing slashes for directory matching, as readdirSync provides plain names
          const cleanedPatterns = gitignorePatterns.map(pattern => pattern.endsWith('/') ? pattern.slice(0, -1) : pattern);
          excludeDirs = [...new Set([...excludeDirs, ...cleanedPatterns])]; // Merge and remove duplicates
        }
      } catch (error: any) {
        console.warn(`Warning: Could not read or parse .gitignore file at ${gitignorePath}: ${error.message}`);
      }
    }

    if (!['B', 'KB', 'MB', 'GB'].includes(sizeUnit)) {
      console.error('Error: Invalid size unit. Choose from B, KB, MB, GB.');
      process.exit(1);
    }

    if (isNaN(maxDepth) || maxDepth < 0) {
        console.error('Error: Invalid level value. Level must be a non-negative integer.');
        process.exit(1);
    }

    try {
      const stats = fs.statSync(targetDirectory);
      if (!stats.isDirectory()) {
        console.error(`Error: ${targetDirectory} is not a directory.`);
        process.exit(1);
      }

      const treeOptions: TreeOptions = {
        exclude: excludeDirs,
        showIcons: showIcons,
        showMetadata: showMetadata,
        showSizeOnly: showSizeOnly,
        sizeDisplayUnit: sizeUnit,
        applyGitignore: useGitignore,
        // showHidden could be added here if it were a command option
      };

      const treeHeader = "```\n" + targetDirectory + "\n";
      const treeBody = generateTree(targetDirectory, '', true, 0, maxDepth, treeOptions);
      const treeOutput = treeHeader + treeBody + "```\n";

      if (outputFile) {
        writeOutputToFile(outputFile, treeOutput);
      } else {
        console.log(treeOutput);
      }
    } catch (error: any) {
      handleError(error, targetDirectory, outputFile);
    }
  });

function writeOutputToFile(filePath: string, content: string): void {
  try {
    fs.writeFileSync(filePath, content);
    console.log(`Tree structure saved to ${filePath}`);
  } catch (error: any) {
    console.error(`Error writing to file ${filePath}: ${error.message}`);
    process.exit(1);
  }
}

function handleError(error: any, targetDir: string, outFile?: string): void {
  if (error.code === 'ENOENT') {
    console.error(`Error: Directory ${targetDir} not found.`);
  } else if (outFile && error.message.includes(outFile)) { // Check if error is related to output file
    // Error already handled by writeOutputToFile, but this is a safeguard
    console.error(`Error related to output file ${outFile}: ${error.message}`);
  }
  else {
    console.error(`An unexpected error occurred: ${error.message}`);
  }
  process.exit(1);
}

const fileExtensionIcons: { [key: string]: string } = {
  // Images
  '.jpeg': '🖼️ ', '.jpg': '🖼️ ', '.png': '🖼️ ', '.gif': '🖼️ ', '.bmp': '🖼️ ', '.webp': '🖼️ ', '.svg': '🖼️ ',
  // Videos
  '.mp4': '🎬 ', '.mov': '🎬 ', '.avi': '🎬 ', '.mkv': '🎬 ', '.webm': '🎬 ',
  // Audio
  '.mp3': '🎵 ', '.wav': '🎵 ', '.ogg': '🎵 ', '.flac': '🎵 ', '.aac': '🎵 ',
  // Documents
  '.pdf': '📝 ', '.doc': '📝 ', '.docx': '📝 ', '.txt': '📄 ', '.md': '📄 ',
  // Archives
  '.zip': '📦 ', '.rar': '📦 ', '.tar': '📦 ', '.gz': '📦 ',
  // Code
  '.js': '📜 ', '.ts': '📜 ', '.py': '📜 ', '.java': '📜 ', '.html': '📜 ', '.css': '📜 ',
  // Default file icon (fallback)
  default: '📄 '
};

function getFileIcon(fileName: string, isDirectory: boolean, showIcons: boolean): string {
  if (!showIcons) return '';
  if (isDirectory) return '📁 ';
  const extension = path.extname(fileName).toLowerCase();
  return fileExtensionIcons[extension] || fileExtensionIcons.default;
}

function formatSize(bytes: number, unit: string): string {
  if (unit === 'B') {
    return `${bytes}B`;
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    if (units[i] === unit) break; // Stop if current unit matches target unit
    size /= 1024;
    i++;
  }
  // If the loop finished because the target unit was reached or it's the largest unit
  if (units[i] === unit || i === units.indexOf(unit)) {
    return `${size.toFixed(2)}${units[i]}`;
  }
  // Fallback or if the unit is smaller than the auto-calculated one, recalculate for the specified unit
  const targetIndex = units.indexOf(unit);
  if (targetIndex !== -1) {
    size = bytes / Math.pow(1024, targetIndex);
    return `${size.toFixed(2)}${unit}`;
  }

  return `${bytes}B`; // Default fallback if unit is unrecognized after initial checks
}

function processEntry(
  entryName: string,
  entryPath: string,
  indent: string,
  isLastEntry: boolean,
  isParentLast: boolean,
  currentDepth: number,
  maxDepth: number,
  options: TreeOptions
): string {
  let output = '';
  const lineChar = isLastEntry ? '└── ' : '├── ';
  const prefix = indent + lineChar;
  const nextIndent = indent + (isParentLast && isLastEntry ? '    ' : '│   ');

  let isDirectory = false;
  let stats: fs.Stats | undefined;
  try {
    stats = fs.statSync(entryPath);
    isDirectory = stats.isDirectory();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Add error message to the output for this specific entry
    return `${prefix}[Error stating: ${entryName} - ${errorMessage}]\n`;
  }

  const icon = getFileIcon(entryName, isDirectory, options.showIcons);
  let metadataInfo = '';
  if ((options.showMetadata || options.showSizeOnly) && stats) {
    const size = formatSize(stats.size, options.sizeDisplayUnit);
    if (options.showSizeOnly) {
      metadataInfo = ` (Size: ${size})`;
    } else if (options.showMetadata) {
      const modified = stats.mtime.toLocaleDateString();
      metadataInfo = ` (Size: ${size}, Modified: ${modified})`;
    }
  }
  output += `${prefix}${icon}${entryName}${metadataInfo}\n`;

  if (isDirectory && currentDepth < maxDepth -1) { // Check depth before recursing
    output += generateTree(entryPath, nextIndent, isParentLast, currentDepth + 1, maxDepth, options);
  }
  return output;
}

function generateTree(
  dirPath: string,
  indent: string = '',
  isParentLast: boolean = true,
  currentDepth: number = 0,
  maxDepth: number = Infinity,
  options: TreeOptions = { exclude: [], showIcons: false, showMetadata: false, showSizeOnly: false, sizeDisplayUnit: 'B', applyGitignore: false }
): string {
  if (currentDepth >= maxDepth) {
    return '';
  }

  let filesInDir: string[];
  try {
    filesInDir = fs.readdirSync(dirPath);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Log and return an empty string for this level if directory can't be read
    // The error is more gracefully handled by not adding to the tree string itself
    // console.warn(`${indent}└── [Error reading directory: ${path.basename(dirPath)} - ${errorMessage}]`);
    // Modified to return an error string that can be part of the tree if preferred
    return `${indent}└── [Error reading directory: ${path.basename(dirPath)} - ${errorMessage}]\n`;
  }

  let output = '';

  let filteredFiles = options.showHidden
    ? filesInDir
    : filesInDir.filter(file => !file.startsWith('.'));

  filteredFiles = filteredFiles.filter(file => !options.exclude.includes(file));

  filteredFiles.forEach((file, index) => {
    const filePath = path.join(dirPath, file);
    const isCurrentLast = index === filteredFiles.length - 1;
    output += processEntry(file, filePath, indent, isCurrentLast, isParentLast, currentDepth, maxDepth, options);
  });

  return output;
}

program.parse(process.argv);