import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { ProgramOptions, TreeOptions } from './types';
import { generateTree } from './tree-generator';
import { writeOutputToFile } from './file-writer';
import { handleError } from './error-handler';

export function setupTreeCommand(): Command {
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
            const cleanedPatterns = gitignorePatterns.map(pattern => pattern.endsWith('/') ? pattern.slice(0, -1) : pattern);
            excludeDirs = [...new Set([...excludeDirs, ...cleanedPatterns])];
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

  return program;
} 