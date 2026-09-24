// package.json のバージョンを更新し、コミットとタグ作成を行う
// 使い方: npm run release (更新の種類は対話形式で選択する)
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJsonPath = path.join(rootDir, "package.json");
const packageLockPath = path.join(rootDir, "package-lock.json");

const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/;
const RELEASE_TYPES = ["patch", "minor", "major"];

function fail(message) {
  console.error(`エラー: ${message}`);
  process.exit(1);
}

function git(...args) {
  return execFileSync("git", args, { cwd: rootDir, encoding: "utf8" }).trim();
}

function nextVersion(current, type) {
  const match = SEMVER.exec(current);
  if (!match) fail(`現在のバージョン "${current}" が x.y.z 形式ではありません`);
  const [major, minor, patch] = match.slice(1).map(Number);

  switch (type) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
  }
}

// 番号または名前で選択させ、不正な入力なら再入力を求める
async function askReleaseType(current) {
  console.log(`現在のバージョン: ${current}`);
  RELEASE_TYPES.forEach((type, i) => {
    console.log(`  ${i + 1}) ${type.padEnd(5)}  -> ${nextVersion(current, type)}`);
  });

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  // 選択前に Ctrl+C や入力終了で閉じられた場合は何もせず終了する
  let selected = false;
  rl.on("SIGINT", () => rl.close());
  rl.once("close", () => {
    if (!selected) {
      console.log();
      fail("中断しました");
    }
  });
  try {
    for (;;) {
      const answer = (await rl.question("更新の種類を選択してください [1-3]: ")).trim();
      const type = RELEASE_TYPES[Number(answer) - 1] ?? RELEASE_TYPES.find((t) => t === answer);
      if (type) {
        selected = true;
        return type;
      }
      console.log("1〜3 または patch / minor / major を入力してください");
    }
  } finally {
    rl.close();
  }
}

// 元ファイルの改行コードとインデントを保ったまま version を書き換える
function updateJsonFile(filePath, update) {
  const raw = readFileSync(filePath, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const json = JSON.parse(raw);
  update(json);
  const body = JSON.stringify(json, null, 2).replace(/\n/g, eol);
  writeFileSync(filePath, body + (raw.endsWith(eol) ? eol : ""));
}

if (git("status", "--porcelain") !== "") {
  fail("コミットされていない変更があります。先にコミットまたは退避してください");
}
try {
  git("symbolic-ref", "-q", "HEAD");
} catch {
  fail("detached HEAD 状態です。ブランチをチェックアウトしてから実行してください");
}

const current = JSON.parse(readFileSync(packageJsonPath, "utf8")).version;
const version = nextVersion(current, await askReleaseType(current));
const tag = `v${version}`;

if (git("tag", "--list", tag) !== "") fail(`タグ ${tag} は既に存在します`);

updateJsonFile(packageJsonPath, (json) => {
  json.version = version;
});
const files = ["package.json"];
if (existsSync(packageLockPath)) {
  updateJsonFile(packageLockPath, (json) => {
    json.version = version;
    if (json.packages?.[""]) json.packages[""].version = version;
  });
  files.push("package-lock.json");
}

git("add", ...files);
git("commit", "-m", `chore: release ${tag}`);
git("tag", "-a", tag, "-m", tag);

console.log(`${current} -> ${version} に更新し、タグ ${tag} を作成しました`);
console.log(`リモートへ反映する場合: git push --follow-tags`);
