import path from 'path';

const fileExtensionIcons: { [key: string]: string } = {
  // Images
  '.jpeg': '🖼️ ', '.jpg': '🖼️ ', '.png': '🖼️ ', '.gif': '🖼️ ', '.bmp': '🖼️ ', '.webp': '🖼️ ', '.svg': '🖼️ ',
  // Videos
  '.mp4': '🎬 ', '.mov': '🎬 ', '.avi': '🎬 ', '.mkv': '🎬 ', '.webm': '🎬 ',
  // Audio
  '.mp3': '🎵 ', '.wav': '🎵 ', '.ogg': '🎵 ', '.flac': '🎵 ', '.aac': '🎵 ',
  // Documents
  '.pdf': '📝 ', '.doc': '📝 ', '.docx': '📝 ', '.txt': '📄 ', '.md': '📄 ',
  // Archives
  '.zip': '📦 ', '.rar': '📦 ', '.tar': '📦 ', '.gz': '📦 ',
  // Code
  '.js': '📜 ', '.ts': '📜 ', '.py': '📜 ', '.java': '📜 ', '.html': '📜 ', '.css': '📜 ',
  // Default file icon (fallback)
  default: '📄 '
};

export function getFileIcon(fileName: string, isDirectory: boolean, showIcons: boolean): string {
  if (!showIcons) return '';
  if (isDirectory) return '📁 ';
  const extension = path.extname(fileName).toLowerCase();
  return fileExtensionIcons[extension] || fileExtensionIcons.default;
} 