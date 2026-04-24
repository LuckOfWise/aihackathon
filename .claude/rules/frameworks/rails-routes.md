---
paths:
  - "config/routes.rb"
  - "config/routes/**"
---
# Rails Routes Rules

## Principles

- RESTful設計 (標準7アクションのみ, カスタムアクション必要時は新コントローラー作成)
- ネスト制限 (2-3レベルまで, 深いネストは避ける)
- アクション制限明示 (only/exceptで必要なアクションのみ公開)
- 名前空間別ファイル分離 (`config/routes/`に名前空間別ファイル, `draw`メソッドで読み込み)
- 単一リソース (`resource`使用, ユーザー固有の単一リソースにはIDなしURL)
