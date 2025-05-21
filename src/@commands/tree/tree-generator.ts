import fs from 'fs';
import path from 'path';
import { TreeOptions } from './types';
import { getFileIcon } from './icons';
import { formatSize } from './formatters';

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

  if (isDirectory && currentDepth < maxDepth - 1) {
    output += generateTree(entryPath, nextIndent, isParentLast, currentDepth + 1, maxDepth, options);
  }
  return output;
}

export function generateTree(
  dirPath: string,
  indent: string = '',
  isParentLast: boolean = true,
  currentDepth: number = 0,
  maxDepth: number = Infinity,
  options: TreeOptions
): string {
  if (currentDepth >= maxDepth) {
    return '';
  }

  let filesInDir: string[];
  try {
    filesInDir = fs.readdirSync(dirPath);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
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