import { getFileIcon } from '../@commands/icons';

describe('Icons', () => {
  function toCodePoints(str: string) {
    return Array.from(str).map(c => c.codePointAt(0));
  }
  describe('getFileIcon', () => {
    it('should return directory icon when isDirectory is true', () => {
      const expected = '📁 ';
      expect(toCodePoints(getFileIcon('test', true, true))).toEqual(toCodePoints(expected));
    });

    it('should return file icon for known file types', () => {
      const jsExpected = '📜 ';
      const docExpected = '📄 ';
      expect(toCodePoints(getFileIcon('test.js', false, true))).toEqual(toCodePoints(jsExpected));
      expect(toCodePoints(getFileIcon('test.json', false, true))).toEqual(toCodePoints(docExpected));
      expect(toCodePoints(getFileIcon('test.md', false, true))).toEqual(toCodePoints(docExpected));
    });

    it('should return default file icon for unknown file types', () => {
      const expected = '📄 ';
      expect(toCodePoints(getFileIcon('test.xyz', false, true))).toEqual(toCodePoints(expected));
    });

    it('should return empty string when icons are disabled', () => {
      expect(getFileIcon('test.js', false, false)).toBe('');
      expect(getFileIcon('test', true, false)).toBe('');
    });
  });
}); 