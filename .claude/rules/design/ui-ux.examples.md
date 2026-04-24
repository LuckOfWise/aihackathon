# UI/UX デザインガイドライン - Examples

SharePage のデザインパターンの Good / Bad。実装は `app/views` と `app/assets/stylesheets/application.css` を参照。

## 1. 避けたい既視感

### Bad: SaaS テンプレ・ヒーロー + 3カード

```erb
<%# ログインページにありがちな既視感 %>
<div class="hero" style="background: linear-gradient(180deg, #fff, #fafafa);">
  <h1>書いた文書を、URLひとつで渡す。</h1>
  <p>説明文...</p>
  <button>Googleでログイン</button>
</div>
<div class="features grid-3">
  <div class="card"><svg/><h3>アップロード</h3><p>...</p></div>
  <div class="card"><svg/><h3>公開範囲</h3><p>...</p></div>
  <div class="card"><svg/><h3>Claude 連携</h3><p>...</p></div>
</div>
```

### Good: 中央集中 + モノラベル

```erb
<%# 集中系は max-width: 460px の単一カラム %>
<div class="login">
  <header class="login__topbar">
    <span class="login__brand">SharePage</span>
    <span class="login__version">v1.0</span>
  </header>

  <main class="login__center">
    <div class="login__card">
      <div class="login__mark">SIGN IN</div>
      <h1 class="login__title">書いた文書を、<br>URLひとつで渡す。</h1>
      <p class="login__lede">HTML と Markdown を預けて、<br>共有範囲ごとにリンクを発行する。</p>
      <%= button_to "Google でログイン", "/auth/google_oauth2", method: :post, class: "login__google" %>
      <p class="login__note">Claude との連携は <%= link_to "MCP 設定", mcp_setup_path %> から。</p>
      <dl class="login__specs">
        <div class="login__spec"><dt>形式</dt><dd>HTML / Markdown、テキスト直接入力</dd></div>
        <div class="login__spec"><dt>公開範囲</dt><dd>限定共有 / ドメイン内 / リンクを知る全員</dd></div>
        <div class="login__spec"><dt>認証</dt><dd>Google アカウント (OAuth 2.0)</dd></div>
      </dl>
    </div>
  </main>
</div>
```

```scss
.login__card { max-width: 460px; }
.login__mark {
  font-family: var(--font-mono); font-size: 11px; font-weight: 500;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--color-text-muted);
  display: flex; align-items: center; gap: 10px;
  &::before, &::after { content: ""; flex: 1; height: 1px; background: var(--color-border); }
}
.login__specs { border-top: 1px solid var(--color-border); padding-top: 24px; }
.login__spec {
  display: flex; gap: 14px; font-size: 12px;
  dt { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 72px; }
}
```

## 2. 一覧 (Dense List vs カードグリッド)

### Bad: カードグリッド

```scss
.documents__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}
.documents__card {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
  &:hover { box-shadow: var(--shadow-md); }
}
```

SaaS テンプレの既視感が強い。画像前提で設計されがち。

### Good: Dense List (行グリッド)

```erb
<div class="documents">
  <div class="documents__listhdr">
    <span>タイトル</span>
    <span>抜粋</span>
    <span>公開範囲</span>
    <span>共有URL</span>
    <span>更新</span>
    <span></span>
  </div>
  <% @documents.each do |doc| %>
    <%= link_to doc, class: "documents__row" do %>
      <span class="documents__title"><%= doc.title %></span>
      <span class="documents__excerpt"><%= doc.text_excerpt %></span>
      <span class="documents__vis documents__vis--<%= doc.visibility %>">
        <span class="documents__dot"></span><%= t("documents.visibility.#{doc.visibility}") %>
      </span>
      <span class="documents__url"><%= short_share_url(doc) %></span>
      <span class="documents__date"><%= l(doc.updated_at, format: :short) %></span>
      <span class="documents__more"><%= svg_icon("more-vertical") %></span>
    <% end %>
  <% end %>
</div>
```

```scss
.documents__listhdr,
.documents__row {
  display: grid;
  grid-template-columns:
    minmax(260px, 1.5fr)  // title
    minmax(220px, 1fr)    // excerpt
    110px                 // visibility
    200px                 // URL
    90px                  // date
    40px;                 // more
  gap: 12px;
}

.documents__listhdr {
  padding: 10px 0;
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--color-border);
}

.documents__row {
  padding: 11px 0;
  font-size: 13px;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background var(--transition);
  &:hover { background: var(--color-bg); }
}

.documents__title { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.documents__excerpt { color: var(--color-text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.documents__url, .documents__date { font-family: var(--font-mono); }
```

## 3. アプリケーションヘッダー

### Bad: 独立したログアウトボタン

```erb
<nav class="navbar">
  <div class="navbar__brand">SharePage</div>
  <div class="navbar__menu">
    <%= link_to "MCP設定", mcp_setup_path %>
    <span><%= current_user.name %></span>
    <%= button_to "ログアウト", logout_path, method: :delete %>
  </div>
</nav>
```

ログアウトが視覚的に主張しすぎる。

### Good: アバターピル内ドロップダウン

```erb
<nav class="navbar">
  <%= link_to root_path, class: "navbar__brand" do %>
    <%= svg_icon("file") %>SharePage
  <% end %>

  <div class="navbar__menu">
    <%= link_to "MCP設定", mcp_setup_path, class: "navbar__link" %>

    <div class="navbar__user" data-controller="dropdown">
      <button class="navbar__user-pill" data-action="dropdown#toggle">
        <span class="navbar__avatar"><%= current_user.initial %></span>
        <span><%= current_user.name %></span>
        <%= svg_icon("chevron-down", class: "navbar__chev") %>
      </button>
      <div class="navbar__user-menu" data-dropdown-target="menu" hidden>
        <%= button_to "ログアウト", logout_path, method: :delete, class: "navbar__menu-item" %>
      </div>
    </div>
  </div>
</nav>
```

```scss
.navbar__user-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 4px 10px 4px 6px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  &:hover { background: var(--color-bg); border-color: var(--color-border-hover); }
}
.navbar__avatar {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--color-primary); color: #fff;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700;
}
.navbar__chev { color: var(--color-text-muted); }
```

## 4. ボタン階層

### Primary (1ページに1つ)

```scss
.page__primary-btn {
  padding: 8px 16px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: background var(--transition);
  &:hover { background: var(--color-primary-hover); }
}
```

### Outline (二次)

```scss
.page__outline-btn {
  padding: 7px 16px;
  background: none;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius);
  cursor: pointer;
  transition: border-color var(--transition), color var(--transition);
  &:hover { border-color: var(--color-text-muted); color: var(--color-text); }
}
```

### Danger (破壊的 / 最も控えめ)

**Good:**
```scss
.page__delete-btn {
  padding: 4px 0;
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: color var(--transition);
  &:hover { color: var(--color-danger); }
}
```

**Bad:**
```scss
// 破壊的操作を目立つ赤ボタンにする
.page__delete-btn {
  background: var(--color-danger);
  color: white;
  padding: 12px 24px;
  font-weight: 700;
}
```

## 5. モノラベルブロック (メタ列挙)

### Good

```erb
<dl class="document__specs">
  <div class="document__spec"><dt>形式</dt><dd><%= @document.file.content_type %></dd></div>
  <div class="document__spec"><dt>サイズ</dt><dd><%= number_to_human_size(@document.file.byte_size) %></dd></div>
  <div class="document__spec"><dt>作成</dt><dd><%= l(@document.created_at, format: :short) %></dd></div>
</dl>
```

```scss
.document__specs { border-top: 1px solid var(--color-border); padding-top: 12px; }
.document__spec {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 12px;
  padding: 6px 0;
  font-size: 13px;

  dt {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--color-text-muted);
  }
  dd { color: var(--color-text); font-family: var(--font-mono); font-size: 12px; }
}
```

## 6. 日本語タイポグラフィ

### Good

```scss
html:lang(ja) {
  line-break: strict;
  word-break: normal;
  overflow-wrap: anywhere;
  font-kerning: auto;
  text-autospace: normal;
}

body {
  font-family: "Inter", "Noto Sans JP", "Hiragino Kaku Gothic ProN",
               "Hiragino Sans", system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  letter-spacing: 0;
}

h1, h2, h3 { word-break: auto-phrase; line-height: 1.35; }

p { line-height: 1.75; }
```

### Bad

```scss
body {
  // 和文 fallback 未指定
  font-family: "Inter", sans-serif;
  // 本文に palt を全体適用
  font-feature-settings: "palt";
  // 字間を詰めすぎ
  letter-spacing: -0.02em;
  // 行間が足りない
  line-height: 1.3;
}

// 全体に break-all
* { word-break: break-all; }
```

## 7. 戻るナビゲーション

### Good

```erb
<div class="page__title-group">
  <%= link_to document_path, class: "page__back-icon", title: "一覧に戻る" do %>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  <%% end %>
  <h1 class="page__title">タイトル</h1>
</div>
```

```scss
.page__back-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border-radius: 6px;
  color: var(--color-text-muted);
  transition: color var(--transition), background var(--transition);
  &:hover { color: var(--color-text); background: var(--color-bg); }
}
```

### Bad

```erb
<%# テキスト矢印で1行占有 %>
<div class="breadcrumb">
  <%= link_to "← 一覧に戻る", document_path %>
</div>
<h1>タイトル</h1>
```

## 8. フォーム

### Good (max-width: 680px 中央寄せ)

```erb
<%= form_with(model: @document, class: "documents-new__form") do |form| %>
  <div class="documents-new__field">
    <%= form.label :title, class: "documents-new__label" %>
    <%= form.text_field :title, class: "documents-new__input", required: true %>
  </div>

  <div class="documents-new__field">
    <%= form.label :file, class: "documents-new__label" %>
    <%= form.file_field :file, accept: "text/html,.html,.md,text/markdown", class: "documents-new__input" %>
    <p class="documents-new__hint">HTML / Markdown のみアップロードできます (.html / .md)</p>
  </div>
<% end %>
```

```scss
.documents-new__form { max-width: 680px; margin: 0 auto; }
.documents-new__label { font-size: 12px; font-weight: 500; color: var(--color-text-secondary); }
.documents-new__hint { font-size: 12px; color: var(--color-text-muted); margin-top: 6px; }
```

### Bad

```scss
// フォームが左寄せで浮く
.documents-new__form { max-width: 680px; /* margin auto なし */ }

// ヒント未記載でユーザーが何を入れればいいか分からない
```

## 9. インタラクション必須ルール

### Good

```scss
button, [role="button"], a.btn {
  cursor: pointer;
  transition: all var(--transition);
}

:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-ring);
  outline: none;
}
```

### Bad

```scss
.btn { background: blue; color: white; }              // cursor なし
.btn:hover { background: darkblue; }                  // transition なし
.btn:focus { outline: none; }                         // フォーカス非表示
```
