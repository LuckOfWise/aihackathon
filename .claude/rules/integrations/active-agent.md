---
paths:
  - "app/agents/**/*"
  - "config/active_agent.yml"
---

# ActiveAgent Rules

[ActiveAgent](https://github.com/activeagents/activeagent) は Rails の "missing AI layer" を埋めるフレームワーク。**Agents are Controllers** の思想で、Agent Oriented Programming によって AI 機能を構造化する。

## Principles

- **ApplicationAgent 継承** — 全 Agent は `ApplicationAgent < ActiveAgent::Base` を継承する
- **アクション = 能力** — Agent の各 public メソッドが「できること」。`def search / def book / def confirm` のように動詞で命名し、`prompt` を返す
- **ERB テンプレートでプロンプト** — `app/views/agent_name/action.{text,json,html}.erb` に配置。プロンプト本体をコードに埋め込まない
- **`generate_with` で provider を明示** — `generate_with :openai, model: "gpt-4o-mini"` 等。クラスレベルで宣言
- **`with(...)` でコンテキスト注入** — `MyAgent.with(foo: bar).action.generate_now` の形で引数を渡す
- **Structured Output は JSON schema で宣言** — 予測可能な出力が欲しい場合は `output_schema` を使う
- **ツール使用は Agent 内で `tool` 宣言** — 外部 API 呼び出しは Tool として Agent に持たせる
- **サービスクラスを作らず Agent に置く** — `app/services/` に AI ロジックを置かない（SG原則と整合）。AI機能はすべて `app/agents/` 配下
- **シークレットは `Rails.application.credentials` 経由** — API key を `config/active_agent.yml` に直書きしない

## 配置規約

```
app/agents/
├── application_agent.rb            # 基底クラス（generate_with 宣言）
├── <domain>_agent.rb               # ドメイン別 Agent
└── <domain>/
    └── <specialized>_agent.rb      # 名前空間分離した Agent

app/views/<agent_name>/
├── <action>.text.erb               # テキストプロンプト
├── <action>.json.erb               # JSON プロンプト（tool/schema）
└── <action>.html.erb               # HTML プロンプト（プレビュー用）
```

## 使い方（典型）

```ruby
# app/agents/translation_agent.rb
class TranslationAgent < ApplicationAgent
  def translate
    prompt(
      message: params[:message],
      locale: params[:locale],
    )
  end
end

# 呼び出し側
response = TranslationAgent
  .with(message: "Hi", locale: "ja")
  .translate
  .generate_now

response.message # => "こんにちは"
```

## 非同期 / ストリーミング

- **非同期生成**: `generate_later` で ActiveJob 経由（SolidQueue と組み合わせる）
- **ストリーミング**: ActionCable と連携。Turbo Stream でレスポンスを段階表示

## テスト

- Agent のテストは `spec/agents/*_spec.rb` に配置（モデルスペックと同じ位置づけ）
- プロバイダーへの実通信はスタブ化（VCR / WebMock）
- プロンプトテンプレートのスナップショットを取るより、**入出力の契約**を検証する

## 禁止

- プロンプト文字列を Ruby コード内にベタ書き（ERB テンプレート必須）
- `app/services/` に AI ロジックを置く
- API key を `config/active_agent.yml` に平文で記述
- Agent 内で DB トランザクション外の副作用を勝手に起こす（ツール呼び出しの範囲を明確に）
- 1 Agent に無関係な複数ドメインの責務を詰め込む（ドメインごとに分割）

## Related

- Upstream: https://github.com/activeagents/activeagent
- Docs: https://docs.activeagents.ai
- 設定: `config/active_agent.yml`
- 基底クラス: `app/agents/application_agent.rb`
