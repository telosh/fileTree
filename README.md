# ファイルツリー表示CLIツール

このツールは、指定されたディレクトリのツリー構造をコマンドラインまたはMarkdownファイルに出力します。

## 機能

-   指定されたディレクトリのツリー構造を表示します。
-   表示する階層の深さを指定できます。
-   出力をMarkdownファイルに保存できます。

## インストールと実行

1.  **依存関係のインストール:**

    ```bash
    npm install
    ```

2.  **TypeScriptのコンパイル:**

    ```bash
    npm run build
    ```

3.  **実行:**

    ```bash
    node dist/tree-cli.js [オプション] [ディレクトリパス]
    ```

    または、`npm link` を使用してグローバルコマンドとして登録することも可能です。

    ```bash
    npm link
    tree-cli [オプション] [ディレクトリパス]
    ```

## 使用方法

```
tree-cli [オプション] [dirPath]
```

### 引数

-   `dirPath` (オプション): ツリー構造を表示するディレクトリのパス。指定しない場合はカレントディレクトリ (`.`) になります。

### オプション

-   `-V, --version`: バージョン情報を表示します。
-   `-L, --level <depth>`: ディレクトリツリーの表示階層の深さを指定します。`<depth>` は非負の整数である必要があります。
-   `-o, --output <filepath>`: 出力を指定されたファイルパスにMarkdown形式で書き出します。
-   `-h, --help`: ヘルプメッセージを表示します。

## 使用例

1.  **カレントディレクトリのツリー構造を表示:**

    ```bash
    tree-cli
    ```

2.  **指定したディレクトリ (`src`) のツリー構造を表示:**

    ```bash
    tree-cli src
    ```

3.  **階層を2レベルに制限して表示:**

    ```bash
    tree-cli -L 2
    ```

4.  **結果を `output.md` ファイルに保存:**

    ```bash
    tree-cli -o output.md
    ```

5.  **`src` ディレクトリのツリーを最大1階層まで `src_tree.md` に出力:**
    ```bash
    tree-cli src -L 1 -o src_tree.md
    ```

## 開発

ソースコードは `src` ディレクトリにあります。主なロジックは `src/tree-cli.ts` に記述されています。

### ビルド

```bash
npm run build
```

### 実行 (開発時)

TypeScriptファイルを直接実行する場合 (ts-node が必要):

```bash
ts-node src/tree-cli.ts [オプション] [ディレクトリパス]
``` 