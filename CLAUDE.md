# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
