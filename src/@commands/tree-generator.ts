import fs from 'fs';
import path from 'path';
import { TreeOptions } from './types';
import { getFileIcon } from './icons';
import { formatSize } from './formatters';

export class TreeGenerator {
  private options: TreeOptions;
  private fileSystem: typeof fs;

  constructor(options: TreeOptions, fileSystem: typeof fs = fs) {
    this.options = options;
    this.fileSystem = fileSystem;
  }

  generate(dirPath: string): string {
    const normalizedPath = path.normalize(dirPath).replace(/\\/g, '/');
    const rootName = path.basename(normalizedPath);
    let output = `${rootName}\n`;
    const treeOutput = this.generateTree(normalizedPath, '', true, 0);
    if (treeOutput) {
      output += treeOutput;
    }
    return output;
  }

  private generateTree(
    dirPath: string,
    indent: string = '',
    isParentLast: boolean = true,
    currentDepth: number = 0
  ): string {
    if (currentDepth >= this.options.level) {
      return '';
    }

    let filesInDir: string[];
    try {
      filesInDir = this.fileSystem.readdirSync(dirPath);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return `${indent}└── [Error reading directory: ${path.basename(dirPath)} - ${errorMessage}]\n`;
    }

    let output = '';
    const filteredFiles = filesInDir.filter(file => !this.options.exclude.includes(file));

    filteredFiles.forEach((file, index) => {
      const filePath = path.join(dirPath, file);
      const isCurrentLast = index === filteredFiles.length - 1;
      output += this.processEntry(file, filePath, indent, isCurrentLast, isParentLast, currentDepth);
    });

    return output;
  }

  private processEntry(
    entryName: string,
    entryPath: string,
    indent: string,
    isLastEntry: boolean,
    isParentLast: boolean,
    currentDepth: number
  ): string {
    let output = '';
    const lineChar = isLastEntry ? '└── ' : '├── ';
    const prefix = indent + lineChar;
    const nextIndent = indent + (isParentLast && isLastEntry ? '    ' : '│   ');

    let isDirectory = false;
    let stats: fs.Stats | undefined;
    try {
      stats = this.fileSystem.statSync(entryPath);
      isDirectory = stats.isDirectory();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return `${prefix}[Error stating: ${entryName} - ${errorMessage}]\n`;
    }

    const icon = getFileIcon(entryName, isDirectory, this.options.showIcons);
    let metadataInfo = '';
    if ((this.options.showMetadata || this.options.showSizeOnly) && stats) {
      const size = formatSize(stats.size, this.options.sizeDisplayUnit);
      if (this.options.showSizeOnly) {
        metadataInfo = ` (Size: ${size})`;
      } else if (this.options.showMetadata) {
        const modified = stats.mtime.toLocaleDateString();
        metadataInfo = ` (Size: ${size}, Modified: ${modified})`;
      }
    }
    output += `${prefix}${icon}${entryName}${metadataInfo}\n`;

    if (isDirectory && currentDepth < this.options.level - 1) {
      const subTree = this.generateTree(entryPath, nextIndent, isLastEntry, currentDepth + 1);
      if (subTree) {
        output += subTree;
      }
    }
    return output;
  }
} 