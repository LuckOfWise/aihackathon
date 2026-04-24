---
paths:
  - "app/controllers/**"
---
# Rails Controllers Rules

## Principles

- 名前空間による分離 (ユーザータイプ/ロール別にコントローラーを名前空間で完全分離)
- 名前空間別基底コントローラー継承 (各名前空間に独自のApplicationControllerを定義)
- 薄いコントローラー (ビジネスロジックはモデル/FormObjectに委譲, コントローラーはリクエスト処理に徹する)
- RESTful設計 (標準7アクション活用, カスタムアクション最小限)
- 認可の強制 (after_action :verify_authorized / verify_policies, Deviseコントローラー以外)
- skip_before_action許可リスト (`except:` ではなく `only:` を使用)
- before_actionでリソース取得 (set_* パターンでリソースをセット)
- current_userスコープ (リソース取得はcurrent_user起点で所有者制限)
- Concern分離 (横断的関心事はapp/controllers/concerns/に抽出)
- 名前空間別ApplicationController継承 (各名前空間で`skip_before_action :authenticate_user!` + 独自の`before_action :authenticate_xxx!`を設定)
- layoutの名前空間分離 (コントローラーで独自layoutを指定せず、views/layouts/に命名規則に則ったディレクトリ・ファイルを作成して適用させる)

## Examples

When in doubt: ./rails-controllers.examples.md
