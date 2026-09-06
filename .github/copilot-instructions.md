# GitHub Copilot 向けリポジトリ指示

このリポジトリでコード提案・チャット応答・コードレビューを行う際に参照するガイドです。
プルリクエストをレビューする際は、下記の「アーキテクチャ」の内容を踏まえたうえで、
末尾の「コードレビュー時の確認観点」を重点的にチェックしてください。

## コマンド

```bash
npm start              # build(main + renderer)を実行してからelectronを起動
npm run build          # build:main + build:renderer
npm run build:main      # tsc: src/main.ts + src/db/**/*.ts を dist/ にコンパイル
npm run build:renderer  # vite build: src/renderer を dist/renderer/ にバンドル

npm run db:generate     # drizzle-kit generate: src/db/schema.ts の差分からSQLマイグレーションを生成
npm run db:migrate      # drizzle-kit migrate: drizzle-kit経由でマイグレーションを直接適用(CLI用)
npm run db:studio       # drizzle-kit studio: sqlite DBをブラウズ

npx shadcn@latest add <component>   # shadcn/uiコンポーネントを src/renderer/components/ui に追加
```

テストスイートおよびlintスクリプトは未設定。

## アーキテクチャ

このElectronアプリは、同じリポジトリ内に共存しつつ
それぞれ別のtsconfigとビルドツールでコンパイルされる、
2つの独立したTypeScriptの世界を持つ。
両者の間にビルド上のつながりはないため、
片方の変更がもう片方から見えるとは限らない点に注意し、
importを必ず確認すること。

- **メインプロセス**(`src/main.ts`、`src/db/**`):
  ルートの`tsconfig.json`(`rootDir: src`、`outDir: dist`、module `node16`)を使い、
  素の`tsc`でコンパイルされる。
  `include`には`src/main.ts`と`src/db/**/*.ts`のみが含まれているため、
  これ以外のパスに`src/`配下のファイルを追加した場合は
  `tsconfig.json`の`include`にも追加しないと、
  エラーも出ないままビルド対象から外れる。
- **レンダラープロセス**(`src/renderer/**`):
  `src/renderer`をrootとする別のViteアプリ(`vite.config.mts`参照)で、
  型チェックは別の`tsconfig.renderer.json`
  (DOM lib、JSX、`moduleResolution: bundler`)で行う。
  ビルド成果物は`dist/renderer/`に出力される。
  `src/main.ts`は
  `win.loadFile(path.join(__dirname, "renderer", "index.html"))`
  でこれを読み込んでおり、
  リポジトリルートからの相対パスではなく、
  mainプロセス側のビルド後の`dist/`構造に依存している。
- 両方のtsconfigに`@/*` -> `./src/renderer/*`のpath aliasが定義されている
  (それぞれ別の理由で必要:
  一方はrenderer自身の型チェック用、
  もう一方はshadcn CLIなどのツールがリポジトリルートから
  解決できるようにするため)。
  `vite.config.mts`にも、実際のバンドラー解決のために同じaliasが
  重複して定義されている。
- TypeScriptはv7系。tsconfigで`baseUrl`は使用していない
  (TS7で非推奨のため)。
  `paths`の値はtsconfigファイルからの相対パスとして
  記述する(例: `"./src/renderer/*"`)。

### データベース(drizzle-orm + better-sqlite3)

- スキーマは`src/db/schema.ts`に定義する。
  変更後は`npm run db:generate`を実行し、
  `drizzle/`配下に新しいマイグレーションファイルを生成する
  (設定は`drizzle.config.ts`、dialectは`sqlite`)。
- `src/db/client.ts`は`getDb()`をexportしており、
  `main.ts`の`app.whenReady()`から一度だけ呼び出される。
  `app.getPath("userData")/mementolane.sqlite3`のsqliteファイルを開き、
  `drizzle-orm/better-sqlite3/migrator`の`migrate()`を
  アプリ起動のたびに自動実行する。
  パッケージ後のアプリでは、マイグレーションを別工程で
  手動適用することはなく、
  開発時のみ`db:migrate`/`db:studio`を使う。
- `client.ts`内のマイグレーションフォルダのパスは
  `path.join(__dirname, "..", "..", "drizzle")`で解決しており、
  これはコンパイル後のファイルが`dist/db/client.js`に
  配置される前提(`dist/db/`から2階層上でリポジトリルートに到達する)。
  mainビルドの出力構造を変更した場合は、
  このパスも合わせて修正する必要がある。
- `better-sqlite3`はネイティブモジュールであり、
  システムのNodeではなくElectronのNode ABIに
  一致させる必要がある。
  `npm install`時に`postinstall: electron-rebuild -f -w better-sqlite3`が
  トリガーされ、Electron向けに再ビルドされる。
  Node/Electronのバージョンアップ後などにネイティブモジュール関連の
  エラーが出た場合は、
  `npx electron-rebuild -f -w better-sqlite3`を再実行する。
- ネイティブモジュールのインストールスクリプト
  (`better-sqlite3`、`esbuild`)は、
  package.jsonの`allowScripts`フィールドで許可リスト化している
  (このリポジトリはデフォルトで任意のインストールスクリプトを
  ブロックするため必須)。

### UIスタック

- Tailwind CSS v4を`@tailwindcss/vite`プラグイン経由で使用
  (`tailwind.config.js`は無し。v4はCSSファーストのため)。
  テーマトークン/CSS変数は`src/renderer/index.css`に定義。
- shadcn/uiは`components.json`で設定
  (style: new-york、base color: neutral)。
  コンポーネントは`src/renderer/components/ui/`配下に追加され、
  `cn()`ヘルパーは`src/renderer/lib/utils.ts`にある。

## コードレビュー時の確認観点

このリポジトリ特有の落とし穴を中心に、PRの差分で以下を確認してください。
一般的なコーディング作法の指摘は不要です。

- **`src/`配下に新規`.ts`/`.tsx`ファイルを追加した場合**:
  mainプロセス側のファイル(`src/main.ts`と同階層、
  `src/renderer/`以外)であれば、
  ルートの`tsconfig.json`の`include`に対象パスが
  含まれているか確認する。
  含まれていない場合、ビルドエラーは出ずに
  そのファイルが静かにコンパイル対象から
  除外されるため見逃しやすい。
- **`src/db/schema.ts`を変更したPR**:
  対応するマイグレーションファイルが
  `drizzle/`配下に(`npm run db:generate`により)
  生成され、同じPRに含まれているか確認する。
  スキーマだけ変更してマイグレーションが
  無いPRは、起動時の自動`migrate()`が
  スキーマの変更を反映しない。
- **path alias(`@/*`)の追加・変更**:
  `tsconfig.json`、`tsconfig.renderer.json`、
  `vite.config.mts`の3箇所すべてに
  同じ内容が反映されているか確認する。
  1箇所だけ更新されていると、
  エディタの型解決とViteの実行時解決が
  食い違う。
- **プロセス境界を越えたimport**:
  `src/renderer/**`のコードがElectronの
  `electron`モジュールやNode組み込みモジュール
  (`fs`、`path`、`better-sqlite3`など)を
  直接importしていないか確認する。
  レンダラーからDBやファイルシステムを扱う場合は、
  IPC経由でmainプロセスに処理を委譲する設計に
  なっているか確認する。
  逆に`src/main.ts`・`src/db/**`側で、
  DOM APIやReactなどrenderer専用の依存を
  参照していないかも確認する。
- **`__dirname`ベースのパス解決を変更した場合**:
  `src/main.ts`の`win.loadFile(...)`や
  `src/db/client.ts`の`migrationsFolder`は、
  コンパイル後の`dist/`ディレクトリ構造
  (`dist/main.js`、`dist/db/client.js`)を
  前提にした相対パスになっている。
  出力構造を変えるリファクタリングでは、
  これらのパスも合わせて更新されているか確認する。
- **依存パッケージの追加**:
  実行時に必要なパッケージが`dependencies`、
  型定義やビルドツールのみが`devDependencies`に
  区分されているか確認する。
  ネイティブモジュール(better-sqlite3のような
  ビルドスクリプトを持つパッケージ)を追加した場合は、
  `package.json`の`allowScripts`への追加漏れ、
  および`postinstall`での
  `electron-rebuild`対象への追加漏れがないか確認する。
