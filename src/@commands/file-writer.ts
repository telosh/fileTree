import fs from 'fs';

export class FileWriter {
  private fileSystem: typeof fs;

  constructor(fileSystem: typeof fs = fs) {
    this.fileSystem = fileSystem;
  }

  writeToFile(filePath: string, content: string): void {
    try {
      this.fileSystem.writeFileSync(filePath, content, 'utf8');
      console.log(`Tree structure saved to ${filePath}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error writing to file ${filePath}: ${errorMessage}`);
      throw error;
    }
  }
}

export function writeOutputToFile(filePath: string, content: string): void {
  const writer = new FileWriter();
  writer.writeToFile(filePath, content);
} 