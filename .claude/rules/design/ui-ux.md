<!--
Contract Metadata
  Locale: ja
  Profile: base
  Review status: initialized (to be updated per release)
  Last reviewed at: 2026-04-21
  jp-ui-contracts ref: 5700b944e69b375fc7d4cc18a146b01c5f671c6e
  sharepage styles ref: doc/agent/styles.md
-->

# UI/UX デザインガイドライン

AI Hackathon プロジェクト固有。普遍デザイン原則は [principles.md](./principles.md) を参照。以下は sharepage を下敷きにした運用例を残しており、**本プロジェクトの UI プロフィール確定時に書き換えること**。

## 絶対ルール (避けたい既視感)

SaaS クリシェの封じ込めを最優先する。**これらを使う前に必ずレビュー**。

| NG パターン | 代替 |
|-----------|------|
| カードグリッド (`auto-fill, minmax`) の一覧 | Dense list (grid 行) |
| グラデーション背景・グラデーションボタン | 単色 + ボーダー |
| 絵文字をアイコン代わり (`←`, `✓`, `🎉` 等) | SVG アイコン (Lucide) |
| 画像サムネイル前提のカード | テキスト主体の行 |
| でかい中央ヒーロー + 3カード特徴紹介 | 中央集中の単一カラム (460px) + モノスペースラベル |
| 独立したログアウトボタン | アバターピル (名前 + ▾) のドロップダウン |
| 中途半端な max-width (`720px`, `760px` 等) | 460 / 680 / フル幅 の 3段階のみ |

## デザイントークン

すべて CSS カスタムプロパティで定義。ハードコード HEX / px は禁止。

### カラー

| トークン | 用途 |
|--------|------|
| `--color-primary` | CTA、リンク、アクティブ状態 |
| `--color-primary-hover` | ホバー時の primary |
| `--color-primary-ring` | フォーカスリング (rgba 15%程度) |
| `--color-danger` | 破壊的操作 (テキストリンク風に使う) |
| `--color-surface` | パネル・行の背景 |
| `--color-bg` | ページ背景 |
| `--color-text` | 主テキスト |
| `--color-text-secondary` | ラベル・メタ情報 |
| `--color-text-muted` | 日付・ヒント・プレースホルダー |
| `--color-border` | 罫線・ボーダー |
| `--color-border-hover` | ホバー時のボーダー強調 |

### スペーシング (4/8px 倍数)

| トークン | 値 | 用途 |
|---------|-----|------|
| `--space-xs` | 4px | アイコン-テキスト間 |
| `--space-sm` | 8px | インライン余白 |
| `--space-md` | 16px | 標準パディング |
| `--space-lg` | 24px | セクションパディング |
| `--space-xl` | 32px | ページ水平パディング |
| `--space-2xl` | 48px | 大セクション間 |

### 角丸

| トークン | 値 | 用途 |
|---------|-----|------|
| `--radius` | 6-8px | ボタン・入力・バッジ |
| `--radius-lg` | 12px | パネル・モーダル |

### シャドウ

最小限のみ使う。一覧の行ホバーではシャドウを使わず背景色のみ。

| トークン | 用途 |
|---------|------|
| `--shadow-md` | ドロップダウン |
| `--shadow-lg` | モーダル |

### トランジション

```css
--transition: 200ms ease;
```

全インタラクティブ要素に統一適用。

## タイポグラフィ

### Font Stack

```css
font-family: "Inter", "Noto Sans JP", "Hiragino Kaku Gothic ProN",
             "Hiragino Sans", system-ui, -apple-system, sans-serif;
```

モノスペース:

```css
font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
```

**和文フォールバックを必ず明示する**。

### Type Scale

| Role | Size | Weight | line-height | letter-spacing |
|------|------|--------|-------------|----------------|
| Display | 30px | 700 | 1.4 | -0.02em |
| H1 | 22-26px | 700 | 1.35 | -0.015em |
| H2 | 18-22px | 700 | 1.4 | 0 |
| H3 / Section label | 11-13px | 600 | 1.4 | 0.08-0.12em (UPPERCASE) |
| Body M | 14px | 400 | 1.55-1.7 | 0 |
| Body S (行内) | 13px | 400 | 1.5 | 0 |
| Caption / Hint | 12px | 400 | 1.55 | 0 |
| Mono Label | 11px | 500 | 1.45 | 0.04-0.2em |
| Mono Value | 12px | 400 | 1.55 | 0 |

### 日本語テキスト規則

- 本文 `line-height`: **1.5 以上**、長文は **1.7-1.85** を優先
- 見出しと本文で `line-height` を分ける (見出し 1.3-1.4、本文 1.5+)
- 本文 `letter-spacing`: `0` 基本、**0.02em を超えない**
- `font-feature-settings: "palt"` を本文に全体適用しない
- 和欧混植は `text-autospace: normal`
- 見出しは `word-break: auto-phrase`
- `word-break: break-all` を全体既定にしない

### モノスペース用途

- セクションラベル (UPPERCASE)、メタデータキー
- URL、トークン、ファイル名、ファイルサイズ
- 日付、バージョン、フッター

## レイアウト

### Container Width Ladder (最重要)

| 用途 | Max Width |
|-----|-----------|
| 集中系 (ログイン) | **460px** |
| フォーム系 (作成・編集・設定) | **680px** |
| 一覧・詳細 | フル幅 |
| プレビュー本文 | 820-1200px |

中途半端な幅は作らない。必ずこの 4段階に寄せる。

### Page Header

```
[ブランド]              [ナビリンク] [アバターピル(▾)]
```

- アバターピル = アバター + 名前 + シェブロン。ドロップダウンでログアウトを出す
- 独立したログアウトボタンを置かない

### Detail 2カラム

```css
grid-template-columns: 1fr 340px;
```

左: 本文 (iframe sandbox プレビュー) / 右: 共有設定パネル

### 一覧 (Dense List)

カードグリッドを作らない。`grid-template-columns` で列を切って行を並べる。

```css
.documents__row {
  display: grid;
  grid-template-columns:
    minmax(260px, 1.5fr)  /* title */
    minmax(220px, 1fr)    /* excerpt */
    110px                 /* visibility */
    200px                 /* URL */
    90px                  /* date */
    40px;                 /* more */
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid var(--color-border);
}
```

- 行高: 40-48px
- ホバー: 背景色のみ (シャドウなし)
- タイトルは weight 600、抜粋は secondary で nowrap + ellipsis
- 公開範囲はドット + ラベル (色だけに頼らない)
- URL・日付はモノスペース

### モノラベルブロック (メタデータ列挙)

```
形式       .html / .md ファイル
公開範囲   限定共有 / ドメイン内 / リンクを知る全員
認証       Google アカウント (OAuth 2.0)
```

ラベル: mono 11px, `letter-spacing: 0.04-0.08em`, muted
値: 本文 13-14px

## インタラクション

| ルール | 詳細 |
|--------|------|
| `cursor: pointer` | 全クリッカブル要素に必須 |
| トランジション | 150-300ms。瞬時の状態変化は禁止 |
| `:focus-visible` | `outline: 2px solid var(--color-primary); outline-offset: 2px` |
| input:focus | `border-color: primary; box-shadow: 0 0 0 3px var(--color-primary-ring)` |
| ホバー | ボタン: 色変化、行: 背景変化、リンク: underline |
| Touch target | 最小 44×44px |
| `prefers-reduced-motion` | アニメーション無効化に対応 |
| Layout shift 禁止 | `scale`, `translate` で周囲を押さない |

## ボタン階層

1ページ内で Primary は **1つだけ**。

| 種類 | 見た目 | 用途 |
|------|--------|------|
| Primary | 背景色 + 白文字 | 最重要アクション (1つのみ) |
| Outline | 白背景 + ボーダー | 二次アクション |
| Ghost | 背景なし + テキスト色 | 三次アクション、キャンセル |
| Danger | テキストリンク風 (muted → danger on hover) | 破壊的操作、最も控えめに |

- 削除は詳細画面の最下部 (Danger Zone)
- Primary を 2つ置かない

## アイコン

- **SVG のみ** (Lucide を基本セットに)
- 絵文字・テキスト矢印 (`←` 等) は不可
- アイコンボタンに `title` 属性でツールチップ
- ストローク幅・サイズを統一

## フォーム

- ラベル: `font-weight: 500; color: var(--color-text-secondary)`
- ヒント: `font-size: 12px; color: var(--color-text-muted)`
- ラジオグループはチップ型 (選択中のみボーダー濃色)
- ファイル入力は `accept` で受入形式を明示 + ヒスト
- 作成時に必要な設定は作成フォームに含める (後から設定画面に回さない)
- フォームカード (`max-width: 680px; margin: 0 auto`)

## レスポンシブ

| Break | 値 | 戦略 |
|-------|-----|------|
| Mobile | 640px | 1カラム、パディング縮小 |
| Desktop | 1024px+ | デフォルト |

- 375px 幅で横スクロールが発生しないこと
- モバイルで一覧ヘッダー行は圧縮/非表示

## コントラスト・アクセシビリティ

| 要件 | 基準 |
|------|------|
| 主テキスト | 4.5:1 以上 (WCAG AA) |
| 副テキスト | 3:1 以上 |
| フォーカス状態 | キーボードナビで視認可能 |
| `prefers-reduced-motion` | 対応 |
| 状態伝達 | 色だけに頼らない (アイコン・テキスト併用) |

## プレデリバリーチェックリスト

UI 実装前・納品前に確認:

### 既視感チェック

- [ ] カードグリッドを使っていない
- [ ] グラデーションを使っていない
- [ ] 絵文字をアイコン代わりに使っていない
- [ ] 画像サムネイルに依存していない
- [ ] ヒーロー+3カードのランディングになっていない
- [ ] max-width が 460 / 680 / フル幅 に収まっている

### 実装品質

- [ ] カラー値がすべてトークン経由
- [ ] スペーシングが 4/8px 倍数
- [ ] SVG アイコンのみ (統一セット)
- [ ] 全クリッカブルに `cursor: pointer`
- [ ] ホバーにトランジション (150-300ms)
- [ ] フォーカス状態が視認可能
- [ ] `prefers-reduced-motion` 対応
- [ ] レスポンシブ (375px / 640px / 1024px)
- [ ] モバイル横スクロールなし
- [ ] プライマリボタンが1ページに1つ
- [ ] 独立ログアウトボタンを置いていない (アバターピルに統合)

### 日本語タイポグラフィ

- [ ] 本文 `line-height: 1.5+`
- [ ] 本文 `letter-spacing: 0-0.02em`
- [ ] 和文 fallback フォントを明示
- [ ] 見出しに `word-break: auto-phrase`
- [ ] `word-break: break-all` を全体適用していない

## Examples

詳細: [ui-ux.examples.md](./ui-ux.examples.md)
