export function handleError(error: any, targetDir: string, outFile?: string): void {
  if (error.code === 'ENOENT') {
    console.error(`Error: Directory ${targetDir} not found.`);
  } else if (outFile && error.message.includes(outFile)) {
    console.error(`Error related to output file ${outFile}: ${error.message}`);
  } else {
    console.error(`An unexpected error occurred: ${error.message}`);
  }
  process.exit(1);
} 