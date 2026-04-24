---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---
# Firebase Rules

## Principles

- ラッパーファースト (firebase/*, firebase-admin/*の直接import禁止、ESLintで強制)
- モデル層分離 (converter, refs, queries, CRUD関数, hooksを分離)
- 型安全コンバーター (`getConverter<T>`でFirestore型安全性確保, WithIdパターン)
- サーバータイムスタンプ (`createdAt`, `updatedAt`自動設定, serverTimestamp()使用)
- waitForPendingWrites (クライアント側の全書き込み操作後に呼び出し)
- シングルトン初期化 (getApps().lengthガード、二重初期化防止)
- エミュレータ自動接続 (環境変数で検出、全サービス対応)

## Examples

When in doubt: ./firebase.examples.md
