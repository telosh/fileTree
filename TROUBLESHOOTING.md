# Troubleshooting Guide

## Common Issues and Solutions

### Permission Errors

**Issue**: "Error: EACCES: permission denied"

**Solutions**:
1. Check if you have read permissions for the target directory
2. Run the command with elevated privileges (sudo/administrator)
3. Verify file ownership and permissions

### Invalid Directory Path

**Issue**: "Error: ENOENT: no such file or directory"

**Solutions**:
1. Verify the directory path is correct
2. Check for typos in the path
3. Ensure the path is accessible from your current location

### Large Directory Performance

**Issue**: Slow performance with large directories

**Solutions**:
1. Use the `--level` option to limit directory depth
2. Exclude unnecessary directories using `--exclude`
3. Use `--use-gitignore` to automatically exclude common development directories

### Output File Issues

**Issue**: Cannot write to output file

**Solutions**:
1. Check write permissions for the target directory
2. Ensure the file is not locked by another process
3. Verify there is enough disk space

### Gitignore Integration

**Issue**: `.gitignore` patterns not working as expected

**Solutions**:
1. Verify `.gitignore` file exists in the target directory
2. Check `.gitignore` syntax
3. Ensure `--use-gitignore` option is enabled

### Icon Display

**Issue**: Icons not displaying correctly

**Solutions**:
1. Ensure your terminal supports Unicode/emoji
2. Check if `--icons` option is enabled
3. Try a different terminal emulator if issues persist

### Size Unit Conversion

**Issue**: Size units not converting correctly

**Solutions**:
1. Verify the `--size-unit` option is set correctly
2. Check if `--metadata` or `--size-only` is enabled
3. Ensure the size values are being read correctly

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](https://github.com/telosh/fileTree/issues) page
2. Create a new issue with:
   - Detailed description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment information (OS, Node.js version)
   - Any relevant error messages 