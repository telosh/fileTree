export class ErrorHandler {
  handleError(error: Error, targetDirectory: string): void {
    let errorMessage: string;
    
    if (error.message.includes('ENOENT')) {
      errorMessage = `Error: Directory not found: ${targetDirectory}`;
    } else if (error.message.includes('EACCES')) {
      errorMessage = `Error: Permission denied: ${targetDirectory}`;
    } else if (error.message.includes('Invalid level value')) {
      errorMessage = `Error: Invalid level value. Level must be a non-negative integer.`;
    } else if (error.message.includes('Invalid size unit')) {
      errorMessage = `Error: Invalid size unit. Choose from B, KB, MB, GB.`;
    } else if (error.message.includes('is not a directory')) {
      errorMessage = `Error: ${error.message}`;
    } else {
      errorMessage = `Error: ${error.message}`;
    }
    
    console.error(errorMessage);
    process.exit(1);
  }
}

export function handleError(error: Error, targetDirectory: string): void {
  const handler = new ErrorHandler();
  handler.handleError(error, targetDirectory);
} 