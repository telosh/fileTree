import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { ProgramOptions, TreeOptions } from './types';
import { TreeGenerator } from './tree-generator';
import { writeOutputToFile } from './file-writer';
import { ErrorHandler } from './error-handler';

export class TreeCommand {
  protected program: Command;
  private fileSystem: typeof fs;
  private errorHandler: ErrorHandler;

  constructor(
    fileSystem: typeof fs = fs,
    errorHandler: ErrorHandler = new ErrorHandler()
  ) {
    this.program = new Command();
    this.fileSystem = fileSystem;
    this.errorHandler = errorHandler;
    this.setupCommand();
  }

  get command(): Command {
    return this.program;
  }

  private setupCommand(): void {
    this.program
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
      .action(async (dirPath: string, options: ProgramOptions) => {
        await this.handleCommand(dirPath, options);
      });
  }

  private convertOptions(options: ProgramOptions): TreeOptions {
    const maxDepth = options.level ? parseInt(options.level, 10) : Infinity;
    const sizeUnit = options.sizeUnit ? options.sizeUnit.toUpperCase() as 'B' | 'KB' | 'MB' | 'GB' : 'B';

    if (!['B', 'KB', 'MB', 'GB'].includes(sizeUnit)) {
      throw new Error('Invalid size unit. Choose from B, KB, MB, GB.');
    }

    if (isNaN(maxDepth) || maxDepth < 0) {
      throw new Error('Invalid level value. Level must be a non-negative integer.');
    }

    return {
      exclude: options.exclude ? options.exclude.split(',').map(dir => dir.trim()) : ['node_modules', '.git'],
      showIcons: !!options.icons,
      showMetadata: !!options.metadata,
      showSizeOnly: !!options.sizeOnly,
      sizeDisplayUnit: sizeUnit,
      applyGitignore: !!options.useGitignore,
      level: maxDepth
    };
  }

  private async handleCommand(dirPath: string, options: ProgramOptions): Promise<void> {
    const targetDirectory = path.resolve(dirPath);
    const outputFile = options.output ? path.resolve(options.output) : undefined;

    try {
      const stats = this.fileSystem.statSync(targetDirectory);
      if (!stats.isDirectory()) {
        throw new Error(`${targetDirectory} is not a directory.`);
      }

      const treeOptions = this.convertOptions(options);
      
      if (treeOptions.applyGitignore) {
        await this.applyGitignore(targetDirectory, treeOptions);
      }

      const generator = new TreeGenerator(treeOptions, this.fileSystem);
      const treeOutput = generator.generate(targetDirectory);

      if (outputFile) {
        writeOutputToFile(outputFile, treeOutput);
      } else {
        console.log(treeOutput);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.errorHandler.handleError(error, targetDirectory);
      } else {
        this.errorHandler.handleError(new Error(String(error)), targetDirectory);
      }
    }
  }

  private async applyGitignore(targetDirectory: string, options: TreeOptions): Promise<void> {
    const gitignorePath = path.join(targetDirectory, '.gitignore');
    try {
      if (this.fileSystem.existsSync(gitignorePath)) {
        const gitignoreContent = this.fileSystem.readFileSync(gitignorePath, 'utf-8');
        const gitignorePatterns = gitignoreContent
          .split(/\r?\n/)
          .filter(line => line.trim() !== '' && !line.startsWith('#'));
        const cleanedPatterns = gitignorePatterns.map(pattern => 
          pattern.endsWith('/') ? pattern.slice(0, -1) : pattern
        );
        options.exclude = [...new Set([...options.exclude, ...cleanedPatterns])];
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Warning: Could not read or parse .gitignore file at ${gitignorePath}: ${errorMessage}`);
    }
  }

  public parse(argv: string[]): void {
    try {
      this.program.parse(argv);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.errorHandler.handleError(error, '.');
      } else {
        this.errorHandler.handleError(new Error(String(error)), '.');
      }
    }
  }
}

export function setupTreeCommand(): Command {
  const command = new TreeCommand();
  return command.command;
} 