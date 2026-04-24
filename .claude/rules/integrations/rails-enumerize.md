---
paths:
  - "app/models/**"
---
# Rails-Enumerize Rules

## Principles

- ApplicationRecordでextend済み (各モデルでextend Enumerize不要)
- step管理にenumerize使用 (state_machine/AASM不使用、enumerize :step + scope: true)
- 述語メソッドの活用 (predicates: trueまたはscope: trueで自動生成される`?`メソッドを使用)
- defaultオプション不使用 (enumerizeのdefaultオプションは使わず、attrのデフォルトを使用)
