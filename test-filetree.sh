#!/bin/bash

# testlogディレクトリの作成
mkdir -p testlog

echo "Testing filetree command..."

# 1. 基本的な使用法（カレントディレクトリ）
echo -e "\n1. Testing basic usage (current directory):"
filetree > testlog/01-basic-usage.txt

# 2. 特定のディレクトリの表示
echo -e "\n2. Testing specific directory:"
filetree src > testlog/02-specific-directory.txt

# 3. 2階層までの表示
echo -e "\n3. Testing 2 levels deep:"
filetree -L 2 > testlog/03-two-levels.txt

# 4. 特定のディレクトリを除外
echo -e "\n4. Testing with excluded directories:"
filetree -e node_modules,dist > testlog/04-excluded-dirs.txt

# 5. 出力をMarkdownファイルに保存
echo -e "\n5. Testing output to markdown file:"
filetree -o testlog/05-markdown-output.md

# 6. アイコン付きで表示
echo -e "\n6. Testing with icons:"
filetree -i > testlog/06-with-icons.txt

# 7. メタデータ付きで表示
echo -e "\n7. Testing with metadata:"
filetree -m > testlog/07-with-metadata.txt

# 8. ファイルサイズのみをKB単位で表示
echo -e "\n8. Testing with size only in KB:"
filetree -m --size-only --size-unit KB > testlog/08-size-only-kb.txt

# 9. .gitignoreを使用
echo -e "\n9. Testing with .gitignore:"
filetree --use-gitignore > testlog/09-with-gitignore.txt

# 10. すべてのオプションを組み合わせたテスト
echo -e "\n10. Testing with all options combined:"
filetree -L 2 -i -m --size-unit KB --use-gitignore -e node_modules,dist > testlog/10-all-options.txt

echo -e "\nAll tests completed! Results are saved in the testlog directory."
echo "You can find the following files in the testlog directory:"
ls -l testlog/ 