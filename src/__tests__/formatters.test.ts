import { formatSize, formatDate } from '../@commands/formatters';

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

    it('should handle zero size', () => {
      expect(formatSize(0, 'B')).toBe('0 B');
      expect(formatSize(0, 'KB')).toBe('0 KB');
      expect(formatSize(0, 'MB')).toBe('0 MB');
      expect(formatSize(0, 'GB')).toBe('0 GB');
    });

    it('should handle very large sizes', () => {
      expect(formatSize(1024 * 1024 * 1024 * 2, 'GB')).toBe('2 GB');
      expect(formatSize(1024 * 1024 * 1024 * 2.5, 'GB')).toBe('2.50 GB');
    });

    it('should handle very small sizes', () => {
      expect(formatSize(1, 'B')).toBe('1 B');
      expect(formatSize(512, 'KB')).toBe('0.50 KB');
    });

    it('should handle exact unit conversions', () => {
      expect(formatSize(1024, 'KB')).toBe('1 KB');
      expect(formatSize(1024 * 1024, 'MB')).toBe('1 MB');
      expect(formatSize(1024 * 1024 * 1024, 'GB')).toBe('1 GB');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-03-21T12:00:00');
      expect(formatDate(date)).toBe('2024-03-21 12:00:00');
    });

    it('should handle single digit month and day', () => {
      const date = new Date('2024-01-01T01:01:01');
      expect(formatDate(date)).toBe('2024-01-01 01:01:01');
    });

    it('should handle single digit hours, minutes and seconds', () => {
      const date = new Date('2024-03-21T01:02:03');
      expect(formatDate(date)).toBe('2024-03-21 01:02:03');
    });

    it('should handle midnight', () => {
      const date = new Date('2024-03-21T00:00:00');
      expect(formatDate(date)).toBe('2024-03-21 00:00:00');
    });

    it('should handle end of day', () => {
      const date = new Date('2024-03-21T23:59:59');
      expect(formatDate(date)).toBe('2024-03-21 23:59:59');
    });
  });
}); 