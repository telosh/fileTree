export function formatSize(bytes: number, unit: string): string {
  if (unit === 'B') {
    return `${bytes}B`;
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    if (units[i] === unit) break;
    size /= 1024;
    i++;
  }
  
  if (units[i] === unit || i === units.indexOf(unit)) {
    return `${size.toFixed(2)}${units[i]}`;
  }
  
  const targetIndex = units.indexOf(unit);
  if (targetIndex !== -1) {
    size = bytes / Math.pow(1024, targetIndex);
    return `${size.toFixed(2)}${unit}`;
  }

  return `${bytes}B`;
} 