import fs from 'fs';

export function writeOutputToFile(filePath: string, content: string): void {
  try {
    fs.writeFileSync(filePath, content);
    console.log(`Tree structure saved to ${filePath}`);
  } catch (error: any) {
    console.error(`Error writing to file ${filePath}: ${error.message}`);
    process.exit(1);
  }
} 