---
paths:
  - "app/javascript/controllers/**"
---
# Rails-Stimulus Integration Rules

## Principles

- TypeScript型宣言 (TypeScriptを利用する場合はstatic targets/valuesの後にdeclareで型付け)
- disconnect()でクリーンアップ必須 (chart.destroy(), popover?.dispose()等)
- 軽量コントローラー (Stimulusコントローラーは最小限のロジック)
- 外部ライブラリのラップ (@stimulus-componentsをカスタムコントローラーでラップして使用)

## Examples

When in doubt: ./rails-stimulus.examples.md
