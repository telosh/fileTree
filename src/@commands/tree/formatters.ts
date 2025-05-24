export function formatSize(bytes: number, unit: string): string {
  if (unit === 'B') {
    return `${bytes} B`;
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
    return `${stripTrailingZeros(size)} ${units[i]}`;
  }
  
  const targetIndex = units.indexOf(unit);
  if (targetIndex !== -1) {
    size = bytes / Math.pow(1024, targetIndex);
    return `${stripTrailingZeros(size)} ${unit}`;
  }

  return `${bytes} B`;
}

function stripTrailingZeros(num: number): string {
  return num % 1 === 0 ? num.toString() : num.toFixed(2).replace(/\.00$/, '');
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
} 