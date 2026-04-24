---
paths:
  - "app/jobs/**"
  - "config/initializers/good_job*.rb"
---
# Rails-Good Job Rules

## Principles

- Good Jobで非同期処理 (Sidekiq不使用, PostgreSQLバックエンド)
- ApplicationJobで共通retry設定 (retry_on StandardError, wait: :polynomially_longer)
- discard_onパターン (FatalErrorは即破棄、リトライ不要な例外を明示)
