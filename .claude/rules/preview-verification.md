# プレビュー動作確認ルール

`mcp__Claude_Preview__preview_*` ツールを使用した動作確認時に常に従うルール。
**ハッカソン当日でも、QA セッションでのプレビュー確認は省略しない**。

## 環境の特殊事情（必読）

このプロジェクトの preview は **ブランチごとに別ポート・別 Docker compose プロジェクト**で起動する:

- `bin/dev-preview` が `bin/setup-preview` を呼び、`.claude/launch.json` を**ブランチ名・worktree ディレクトリ名から動的生成**する
- ポートは `bin/find-port 3130` で空きポートを検出（例: `3132`, `3134`...）
- `COMPOSE_PROJECT_NAME` は `aihackathon_<dirname>` で worktree ごとに分離
- `mcp__Claude_Preview__preview_start` の **PreToolUse hook で `bin/setup-preview` が自動実行**される（`.claude/settings.json` 参照）

つまり worktree が違えば preview インスタンスが衝突しない。**QA セッションは専用 worktree (`.claude/worktrees/qa-review`) で動かす**。

## 基本手順

1. **作業 worktree 内で** `preview_start` を実行（ブランチが切り替わっていれば自動で setup-preview が走る）
2. `preview_start` の戻り値の `port` を控える
3. 変更の影響を受ける画面・機能を特定
4. ログインが必要な場合は Devise の dev login を使う（後述）
5. 以下のツールで確認:
   - `preview_snapshot`: ページ構造・テキスト内容の確認（accessibility tree）
   - `preview_screenshot`: 画面の見た目の確認
   - `preview_click` / `preview_fill`: フォーム送信やボタン操作
   - `preview_console_logs`: JavaScript エラーの確認
   - `preview_network`: API リクエストのエラー確認
   - `preview_eval`: 任意 JS（ナビゲーション等）

## preview_snapshot が空の場合

`preview_snapshot` が `chrome-error://chromewebdata/` 等で空の場合、明示的にナビゲートする:

```js
// preview_eval で実行
window.location = 'http://localhost:<返されたport>/'; 'navigating'
```

少し待ってから `preview_snapshot` を再取得する。

## ログイン

開発用ログインフォームが用意されている場合はそれを利用する（実装されていなければ Devise sign in を経由）:

```javascript
// preview_eval — dev login が実装されている場合
document.querySelector('form[action="/users/dev_login"]')?.submit()
```

dev login が無いプロジェクト初期状態では `preview_fill` でメール/パスワードを入力 → `preview_click` で sign in する。

## フォーム画面の動作確認（フォーム変更がある PR では必須）

スクリーンショット・要素存在確認だけでなく、実際にフォームを操作してデータフローを検証する。

1. **バリデーション確認**: 必須項目を空のまま送信し、エラー表示を確認
2. **新規登録**: 全項目に値を入力 → 送信 → 詳細・一覧で値が反映されていることを確認
3. **編集**: 編集画面で値を変更 → 保存 → 反映を確認
4. **削除**: 削除実行 → 一覧から消えていることを確認

各ステップは `preview_fill` → `preview_click` → `preview_snapshot` のサイクル。

## エラー・警告の追跡

各操作後に必ず以下を確認:

```
preview_console_logs   # JS エラー / 警告
preview_network        # 4xx / 5xx
```

エラーがあれば PR コメントに記録する。

## チェックリスト（QA レビュー時）

- [ ] PR の対象画面に `preview_snapshot` でアクセス可能（ステータス 200 系）
- [ ] 主要操作（CRUD があれば全部）が動く
- [ ] バリデーションエラーが表示される
- [ ] console / network にエラーが出ていない
- [ ] レスポンシブで崩れていない（必要に応じて `preview_resize` で 375px / 1024px 確認）
- [ ] 認証が必要な画面で未ログイン時に正しくリダイレクトされる
