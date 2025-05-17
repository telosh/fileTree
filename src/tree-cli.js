"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const program = new commander_1.Command();
program
    .version('0.1.0')
    .argument('[dirPath]', 'Directory path to display tree structure', '.')
    .option('-L, --level <depth>', 'Descend only <depth> levels in the directory tree.')
    .option('-o, --output <filepath>', 'Write output to a file in Markdown format.')
    .option('-e, --exclude <dirs>', 'Comma-separated list of directory names to exclude.')
    .action((dirPath, options) => {
    const targetDirectory = path_1.default.resolve(dirPath);
    const maxDepth = options.level ? parseInt(options.level, 10) : Infinity;
    const outputFile = options.output ? path_1.default.resolve(options.output) : undefined;
    const excludeDirs = options.exclude ? options.exclude.split(',').map(dir => dir.trim()) : ['node_modules', '.git']; // Default excludes
    if (isNaN(maxDepth) || maxDepth < 0) {
        console.error('Error: Invalid level value. Level must be a non-negative integer.');
        process.exit(1);
    }
    try {
        const stats = fs_1.default.statSync(targetDirectory);
        if (!stats.isDirectory()) {
            console.error(`Error: ${targetDirectory} is not a directory.`);
            process.exit(1);
        }
        const treeHeader = `\`\`\`\n${targetDirectory}\n`;
        const treeBody = generateTree(targetDirectory, '', true, 0, maxDepth, { exclude: excludeDirs });
        const treeOutput = treeHeader + treeBody + '```\n';
        if (outputFile) {
            try {
                fs_1.default.writeFileSync(outputFile, treeOutput);
                console.log(`Tree structure saved to ${outputFile}`);
            }
            catch (error) {
                console.error(`Error writing to file ${outputFile}: ${error.message}`);
                process.exit(1);
            }
        }
        else {
            console.log(treeOutput);
        }
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`Error: Directory ${targetDirectory} not found.`);
        }
        else {
            console.error(`An unexpected error occurred: ${error.message}`);
        }
        process.exit(1);
    }
});
function generateTree(dirPath, indent = '', isParentLast = true, // 親ディレクトリがその階層で最後か
currentDepth = 0, maxDepth = Infinity, options = {}) {
    if (currentDepth >= maxDepth) {
        return '';
    }
    let files;
    try {
        files = fs_1.default.readdirSync(dirPath);
    }
    catch (error) {
        return `${indent}└── [Error reading directory: ${path_1.default.basename(dirPath)}]\n`;
    }
    let output = '';
    // フィルタリング (例: 隠しファイル)
    let filteredFiles = options.showHidden
        ? files
        : files.filter(file => !file.startsWith('.'));
    if (options.exclude) {
        filteredFiles = filteredFiles.filter(file => { var _a; return !((_a = options.exclude) === null || _a === void 0 ? void 0 : _a.includes(file)); });
    }
    filteredFiles.forEach((file, index) => {
        const filePath = path_1.default.join(dirPath, file);
        const isCurrentLast = index === filteredFiles.length - 1;
        // 罫線の決定ロジック (ここが一番複雑)
        // │   ├───
        // │   └───
        //     ├───
        //     └───
        const line = isCurrentLast ? '└── ' : '├── ';
        const prefix = indent + line;
        // 次の階層に渡すインデント
        // 現在の親が最後で、かつ現在の要素も最後なら、次のインデントは空白
        // それ以外の場合は '│   ' を継続
        const nextIndent = indent + (isParentLast && isCurrentLast ? '    ' : '│   ');
        output += `${prefix}${file}\n`;
        try {
            const stats = fs_1.default.statSync(filePath);
            if (stats.isDirectory()) {
                // 弟要素がいる場合、isParentLastはfalseになるべきだが、この再帰構造では現在のisCurrentLastを次のisParentLastとして渡すのが一般的
                output += generateTree(filePath, nextIndent, isCurrentLast, currentDepth + 1, maxDepth, options);
            }
        }
        catch (error) {
            // エラー発生時も罫線を維持
            output += `${nextIndent}${isCurrentLast ? '└── ' : '├── '}[Error accessing: ${file}]\n`;
        }
    });
    return output;
}
program.parse(process.argv);
