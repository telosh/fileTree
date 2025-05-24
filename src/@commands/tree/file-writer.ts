import fs from 'fs';

export class FileWriter {
  writeToFile(content: string, filePath: string): void {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Tree structure saved to ${filePath}`);
    } catch (error: any) {
      console.error(`Error writing to file ${filePath}: ${error.message}`);
      throw error;
    }
  }
} 