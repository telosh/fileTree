import { ErrorHandler } from '../@commands/error-handler';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;
  let consoleSpy: jest.SpyInstance;
  let processSpy: jest.SpyInstance;

  beforeEach(() => {
    errorHandler = new ErrorHandler();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    processSpy = jest.spyOn(process, 'exit').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    processSpy.mockRestore();
  });

  describe('handleError', () => {
    it('should handle ENOENT error', () => {
      const error = new Error('ENOENT: no such file or directory');
      errorHandler.handleError(error, '/test/dir', undefined);

      expect(consoleSpy).toHaveBeenCalledWith('Error: Directory not found: /test/dir');
      expect(processSpy).toHaveBeenCalledWith(1);
    });

    it('should handle EACCES error', () => {
      const error = new Error('EACCES: permission denied');
      errorHandler.handleError(error, '/test/dir', undefined);

      expect(consoleSpy).toHaveBeenCalledWith('Error: Permission denied: /test/dir');
      expect(processSpy).toHaveBeenCalledWith(1);
    });

    it('should handle invalid level value error', () => {
      const error = new Error('Invalid level value');
      errorHandler.handleError(error, '/test/dir', undefined);

      expect(consoleSpy).toHaveBeenCalledWith('Error: Invalid level value. Level must be a non-negative integer.');
      expect(processSpy).toHaveBeenCalledWith(1);
    });

    it('should handle invalid size unit error', () => {
      const error = new Error('Invalid size unit');
      errorHandler.handleError(error, '/test/dir', undefined);

      expect(consoleSpy).toHaveBeenCalledWith('Error: Invalid size unit. Choose from B, KB, MB, GB.');
      expect(processSpy).toHaveBeenCalledWith(1);
    });

    it('should handle not a directory error', () => {
      const error = new Error('/test/file is not a directory');
      errorHandler.handleError(error, '/test/file', undefined);

      expect(consoleSpy).toHaveBeenCalledWith('Error: /test/file is not a directory');
      expect(processSpy).toHaveBeenCalledWith(1);
    });

    it('should handle generic errors', () => {
      const error = new Error('Generic error message');
      errorHandler.handleError(error, '/test/dir', undefined);

      expect(consoleSpy).toHaveBeenCalledWith('Error: Generic error message');
      expect(processSpy).toHaveBeenCalledWith(1);
    });

    it('should handle errors with output file', () => {
      const error = new Error('Write error');
      errorHandler.handleError(error, '/test/dir', '/output.md');

      expect(consoleSpy).toHaveBeenCalledWith('Error: Write error');
      expect(processSpy).toHaveBeenCalledWith(1);
    });
  });
}); 