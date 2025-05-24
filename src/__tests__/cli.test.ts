import { TreeCommand } from '../@commands/cli';
import * as fs from 'fs';
import { ErrorHandler } from '../@commands/error-handler';
import { ProgramOptions } from '../@commands/types';

jest.mock('fs');
jest.mock('../@commands/error-handler');

describe('TreeCommand', () => {
  let treeCommand: TreeCommand;
  let mockErrorHandler: jest.Mocked<ErrorHandler>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockErrorHandler = new ErrorHandler() as jest.Mocked<ErrorHandler>;
    treeCommand = new TreeCommand(fs, mockErrorHandler);
  });

  describe('setupCommand', () => {
    it('should set up command with correct version', () => {
      const command = treeCommand.command;
      expect(command.version()).toBe('0.1.0');
    });

    it('should set up command with correct arguments and options', () => {
      const command = treeCommand.command;
      const options = command.options;
      
      expect(options).toContainEqual(expect.objectContaining({
        flags: '-L, --level <depth>',
        description: 'Descend only <depth> levels in the directory tree.'
      }));

      expect(options).toContainEqual(expect.objectContaining({
        flags: '-o, --output <filepath>',
        description: 'Write output to a file in Markdown format.'
      }));

      expect(options).toContainEqual(expect.objectContaining({
        flags: '-e, --exclude <dirs>',
        description: 'Comma-separated list of directory names to exclude.'
      }));
    });
  });

  describe('convertOptions', () => {
    it('should convert program options to tree options correctly', () => {
      const programOptions: ProgramOptions = {
        level: '2',
        output: 'output.md',
        exclude: 'node_modules,dist',
        icons: true,
        metadata: true,
        sizeOnly: true,
        sizeUnit: 'KB',
        useGitignore: true
      };

      const result = (treeCommand as unknown as { convertOptions: (options: ProgramOptions) => unknown }).convertOptions(programOptions);

      expect(result).toEqual({
        exclude: ['node_modules', 'dist'],
        showIcons: true,
        showMetadata: true,
        showSizeOnly: true,
        sizeDisplayUnit: 'KB',
        applyGitignore: true,
        level: 2
      });
    });

    it('should handle invalid level value', () => {
      const programOptions: ProgramOptions = {
        level: '-1'
      };

      expect(() => (treeCommand as unknown as { convertOptions: (options: ProgramOptions) => unknown }).convertOptions(programOptions))
        .toThrow('Invalid level value. Level must be a non-negative integer.');
    });

    it('should handle invalid size unit', () => {
      const programOptions: ProgramOptions = {
        sizeUnit: 'INVALID'
      };

      expect(() => (treeCommand as unknown as { convertOptions: (options: ProgramOptions) => unknown }).convertOptions(programOptions))
        .toThrow('Invalid size unit. Choose from B, KB, MB, GB.');
    });
  });

  describe('parse', () => {
    it('should handle parsing errors', () => {
      const error = new Error('Parse error');
      (treeCommand as unknown as { program: { parse: (argv: string[]) => void } }).program.parse = jest.fn().mockImplementation(() => {
        throw error;
      });

      treeCommand.parse(['node', 'script.js']);

      expect(mockErrorHandler.handleError).toHaveBeenCalledWith(
        error,
        '.'
      );
    });
  });
}); 