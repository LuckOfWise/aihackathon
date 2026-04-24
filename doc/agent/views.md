# View レイヤー開発ガイドライン

このファイルは `app/views` 配下のファイルで作業する際のガイダンスを提供します。

## 保守性重視の開発制約

### 基本原則
- 長期的なメンテナンス性を優先する
- 新機能開発時は必ず既存の実装パターンを確認・踏襲する
- 技術的負債の蓄積を避け、持続可能な開発を維持する

## スタイリング原則
- 詳細は `styles.md` を参照
- **CSS フレームワーク（Bootstrap 等）は使用しない** - SCSS + BEM で独自スタイルを定義

### CSS クラス命名規則（BEM）

#### 1 View = 1 Block の原則

**各ビューファイルは1つのトップレベル Block を持ち、その中の要素はすべてその Block の Element として定義します。**

```erb
<%# ✅ 推奨: 1つのトップレベル Block %>
<div class="share-page">
  <header class="share-page__header">...</header>
  <div class="share-page__content">...</div>
  <footer class="share-page__footer">...</footer>
</div>

<%# ❌ 禁止: 複数の独立した Block %>
<div class="share-page">
  <header class="share-header">...</header>  <%# share-page__header であるべき %>
  <div class="share-content">...</div>
</div>
```

#### 例外: 再利用可能なコンポーネント
`components/` の汎用コンポーネント（btn, badge, alert 等）は独立した Block として使用可。

#### 基本構文
- **Block**: `.block-name`（ビューに対応するトップレベル要素）
- **Element**: `.block-name__element-name`（Block 内の要素）

### State クラス（`.is-*`）の使い方

**重要**: `.is-*` は**動的な状態変化**のみに使用し、スタイルのバリエーションには使用しない。

#### ✅ 適切な使用（状態変化）
```erb
<%# 状態の変化を表す %>
<span class="share-item__status is-<%= @item.status %>">...</span>
<button class="url-copy__btn" data-copied-class="is-copied">コピー</button>
```

#### ❌ 不適切な使用（バリエーション）
```erb
<%# サイズやレイアウトは状態ではない %>
<div class="card-body is-center">...</div>  <%# ❌ %>
<div class="card-body is-lg">...</div>      <%# ❌ %>
```

#### 正しいバリエーションの表現
```erb
<%# バリエーションは別の Element 名で定義 %>
<div class="page-form__card-body">...</div>   <%# フォーム用 %>
<div class="page-form__result-body">...</div> <%# 結果ページ用 %>
```

#### 例外: 再利用可能なコンポーネント
`components/` の汎用コンポーネントではバリエーションに State class を使用可：
```erb
<%= link_to "保存", path, class: "btn is-primary is-lg" %>
<span class="badge is-owner">オーナー</span>
<div class="alert is-danger">エラー</div>
```

### レイアウト設計原則
- **margin の直接使用を最小限に抑える** - パーシャル内に margin を記述しない
- **外部からの余白制御** - 親要素で margin を調整し、パーシャルの再利用性を向上

## View テンプレート使用時の制約

### 1. レイアウト制御の分離と margin 設計
```erb
<%# ❌ パーシャル内に margin 記述 %>
<div class="component" style="margin-bottom: 16px;">
  <%# パーシャルの内容 %>
</div>

<%# ✅ 外部からの余白制御 %>
<div class="component-wrapper">
  <%= render 'shared/component' %>
</div>
```

### 2. 条件分岐による重複コードの禁止
```erb
<%# ❌ 禁止 %>
<% if preview_mode? %>
  <%= button_to 'フォロー', follow_path, class: 'btn is-primary', disabled: true %>
<% else %>
  <%= button_to 'フォロー', follow_path, class: 'btn is-primary' %>
<% end %>

<%# ✅ 推奨 %>
<%= button_to 'フォロー', follow_path, class: 'btn is-primary', disabled: preview_mode? %>
```

### 3. Strict Locals 宣言
```erb
<%# app/views/application/_fields.html.erb %>
<%# locals: (form:, options: nil) %>

<div class="container">
  <%= form.fields_for :items do |ff| %>
  <% end %>
</div>
```

### 4. locals 経由のデータ渡し
```erb
<%# ✅ locals で明示的に渡す %>
<%= render 'shared/detail', item: @item %>

<%# ❌ パーシャル内でインスタンス変数を直接参照 %>
<%= render 'shared/detail' %>
```

## テンプレートガイドライン
- 全てのテンプレートで **ERB** を使用
- メーラーのテンプレートのみ **HAML** を使用可能

## エラー表示

### フォームのエラー表示
```erb
<%# AI: エラーメッセージの表示 %>
<% if @object.errors.any? %>
  <%= render 'shared/error_messages', object: @object %>
<% end %>
```

## コード品質制約
- DOM 構造の深度を最小限に抑える
- 複雑なロジックはヘルパーメソッドに移動
- ビューに条件分岐が多い場合は、デコレーターパターンの導入を検討

## チェックリスト
- [ ] 1 View = 1 Block の原則に従っている
- [ ] State class（`.is-*`）は状態変化のみに使用している
- [ ] バリエーションは別の Element 名で定義している
- [ ] margin の直接記述を避け、外部からの余白制御を採用
- [ ] 条件分岐による重複コードを回避
- [ ] パーシャルは単一の責務を持つように設計
- [ ] Strict Locals を宣言している
