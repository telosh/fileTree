import { generateTree } from '../@commands/tree/tree-generator';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');
jest.mock('path');

describe('TreeGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
    (path.basename as jest.Mock).mockImplementation((p) => {
      if (!p) return '';
      const parts = p.split(/[\\/]/);
      return parts[parts.length - 1];
    });
  });

  const defaultOptions = {
    level: Infinity,
    exclude: [],
    icons: false,
    metadata: false,
    sizeOnly: false,
    sizeUnit: 'B',
    useGitignore: false,
  };

  describe('generateTree', () => {
    it('should return empty string for empty directory', () => {
      (fs.readdirSync as jest.Mock).mockReturnValue([]);
      (fs.statSync as jest.Mock).mockReturnValue({
        isDirectory: () => false,
        size: 1024,
        mtime: new Date('2024-01-01')
      });

      const result = generateTree('test', '', true, 0, defaultOptions.level, defaultOptions);
      expect(result).toBe('');
    });

    it('should generate tree with files and directories', () => {
      (fs.readdirSync as jest.Mock).mockImplementation((dirPath) => {
        if (dirPath.endsWith('dir1')) return [];
        return ['file1.js', 'dir1'];
      });
      (fs.statSync as jest.Mock).mockImplementation((filePath) => ({
        isDirectory: () => filePath.includes('dir1'),
        size: 1024,
        mtime: new Date('2024-01-01')
      }));

      const result = generateTree('test', '', true, 0, defaultOptions.level, defaultOptions);
      expect(result).toContain('file1.js');
      expect(result).toContain('dir1');
    });

    it('should handle file system errors', () => {
      (fs.readdirSync as jest.Mock).mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const result = generateTree('test', '', true, 0, defaultOptions.level, defaultOptions);
      expect(result).toContain('[Error reading directory: test - Permission denied]');
    });

    it('should respect level limit', () => {
      (fs.readdirSync as jest.Mock).mockImplementation((dirPath) => {
        if (dirPath.endsWith('dir1')) return [];
        return ['dir1'];
      });
      (fs.statSync as jest.Mock).mockReturnValue({
        isDirectory: () => true,
        size: 1024,
        mtime: new Date('2024-01-01')
      });

      const result = generateTree('test', '', true, 0, 1, defaultOptions);
      expect(result).not.toContain('dir1/dir2');
    });

    it('should exclude specified directories', () => {
      (fs.readdirSync as jest.Mock).mockImplementation((dirPath) => {
        if (dirPath.endsWith('node_modules') || dirPath.endsWith('src')) return [];
        return ['node_modules', 'src'];
      });
      (fs.statSync as jest.Mock).mockImplementation((filePath) => ({
        isDirectory: () => true,
        size: 1024,
        mtime: new Date('2024-01-01')
      }));

      const result = generateTree('test', '', true, 0, defaultOptions.level, { ...defaultOptions, exclude: ['node_modules'] });
      expect(result).not.toContain('node_modules');
      expect(result).toContain('src');
    });

    it('should display metadata when enabled', () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(['file1.js']);
      (fs.statSync as jest.Mock).mockReturnValue({
        isDirectory: () => false,
        size: 1024,
        mtime: new Date('2024-01-01')
      });

      const result = generateTree('test', '', true, 0, defaultOptions.level, { ...defaultOptions, metadata: true });
      expect(result).toContain('1024 B');
      expect(result).toMatch(/Modified: (\d{4}\/\d{1,2}\/\d{1,2}|\d{4}-\d{2}-\d{2})/);
    });

    it('should handle symlinks', () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(['link1']);
      (fs.statSync as jest.Mock).mockReturnValue({
        isDirectory: () => false,
        isSymbolicLink: () => true,
        size: 1024,
        mtime: new Date('2024-01-01')
      });

      const result = generateTree('test', '', true, 0, defaultOptions.level, defaultOptions);
      expect(result).toContain('link1');
    });

    it('should handle read errors gracefully', () => {
      (fs.readdirSync as jest.Mock).mockImplementation((dir) => {
        if (dir.includes('error-dir')) {
          throw new Error('Read error');
        }
        return ['file1.js'];
      });
      (fs.statSync as jest.Mock).mockReturnValue({
        isDirectory: () => false,
        size: 1024,
        mtime: new Date('2024-01-01')
      });

      const result = generateTree('error-dir', '', true, 0, defaultOptions.level, defaultOptions);
      expect(result).toContain('[Error reading directory: error-dir - Read error]');
    });

    it('should handle stat errors gracefully', () => {
      (fs.readdirSync as jest.Mock).mockReturnValue(['file1.js']);
      (fs.statSync as jest.Mock).mockImplementation(() => {
        throw new Error('Stat error');
      });

      const result = generateTree('test', '', true, 0, defaultOptions.level, defaultOptions);
      expect(result).toContain('[Error stating: file1.js - Stat error]');
    });
  });
}); 