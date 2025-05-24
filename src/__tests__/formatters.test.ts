import { formatSize, formatDate } from '../@commands/tree/formatters';

describe('Formatters', () => {
  describe('formatSize', () => {
    it('should format size in bytes', () => {
      expect(formatSize(1024, 'B')).toBe('1024 B');
    });

    it('should format size in KB', () => {
      expect(formatSize(1024, 'KB')).toBe('1 KB');
    });

    it('should format size in MB', () => {
      expect(formatSize(1024 * 1024, 'MB')).toBe('1 MB');
    });

    it('should format size in GB', () => {
      expect(formatSize(1024 * 1024 * 1024, 'GB')).toBe('1 GB');
    });

    it('should handle decimal places', () => {
      expect(formatSize(1500, 'KB')).toBe('1.46 KB');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-03-21T12:00:00');
      expect(formatDate(date)).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    });
  });
}); 