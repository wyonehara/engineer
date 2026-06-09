# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

`pomodoro-timer/index.html` 単一ファイルで完結するインターバルタイマーアプリ。ビルドツール・依存ライブラリ・パッケージマネージャは一切なし。

## 実行方法

```sh
open pomodoro-timer/index.html   # macOS でブラウザ起動
```

またはブラウザで `pomodoro-timer/index.html` を直接開く。

## アーキテクチャ

`index.html` に HTML / CSS / JavaScript がすべてインライン。構成は以下の3層。

- **Editor（左パネル）** — `timers` 配列と `repeatCount` を管理。`renderEditor()` が DOM を都度再生成し、入力変更・削除・ドラッグ&ドロップを委譲イベントで処理する。
- **Runner（右パネル）** — `setInterval` ベースの 1 秒 tick で `remaining` をデクリメント。`advance()` がタイマー→セット順に進み、完了で `finish()` を呼ぶ。
- **ビュー切り替え** — `showView('idle' | 'run' | 'done')` が `.hidden` クラスの付け外しで排他表示。

状態変数（`timerIndex`, `repIndex`, `remaining`, `running`, `started`）はすべてモジュールスコープのグローバル変数。`renderEditor()` は実行中もアクティブ行のハイライトに使われるため、Runner からも呼ばれる。

## キーボードショートカット

| キー | 動作 |
|------|------|
| `Space` | 一時停止 / 再開 |
| `←` | 前のタイマーへ |
| `→` | 次のタイマーへ |
