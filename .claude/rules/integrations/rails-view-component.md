---
paths:
  - "app/components/**"
---
# Rails-ViewComponent Rules

## Principles

- BaseComponent継承 (全コンポーネントはBaseComponent/ApplicationComponent < ViewComponent::Baseを継承)
- Slotsパターン (`renders_one`/`renders_many`でコンテンツブロックを宣言的に定義)
- render?ガード (`render?`メソッドで空データ時のレンダリングをスキップ)
- テンプレートとcallメソッドの使い分け (複雑なコンポーネントはテンプレートファイル、簡素なコンポーネントは`call`メソッドで記述)
- Namespace構成 (コンポーネントはドメイン名前空間で整理)

## Examples

When in doubt: ./rails-view-component.examples.md
