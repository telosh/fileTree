import { FileWriter } from '../@commands/tree/file-writer';
import * as fs from 'fs';

jest.mock('fs');

describe('FileWriter', () => {
  let fileWriter: FileWriter;

  beforeEach(() => {
    fileWriter = new FileWriter();
    jest.clearAllMocks();
  });

  describe('writeToFile', () => {
    it('should write content to file', () => {
      const content = 'test content';
      const filePath = 'test.md';

      fileWriter.writeToFile(content, filePath);

      expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, content, 'utf8');
    });

    it('should throw error when write fails', () => {
      const content = 'test content';
      const filePath = 'test.md';
      const error = new Error('Write error');

      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw error;
      });

      expect(() => fileWriter.writeToFile(content, filePath)).toThrow(error);
    });
  });
}); 