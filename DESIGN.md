---
version: alpha
name: Aihackathon
description: AIハッカソン用 Rails 8 + Hotwire アプリの視覚的アイデンティティ。SaaS クリシェを避け、日本語 UI に最適化された「情報密度と可読性の両立」を志向する。
colors:
  primary: "#2563eb"
  primary-hover: "#1d4ed8"
  primary-ring: "#dbeafe"
  primary-tint: "#eff6ff"
  accent: "#0ea5e9"
  success: "#16a34a"
  warning: "#d97706"
  danger: "#dc2626"
  info: "#0284c7"
  surface: "#ffffff"
  surface-alt: "#f9fafb"
  bg: "#fafafa"
  hover-bg: "#f3f4f6"
  text: "#111827"
  text-secondary: "#4b5563"
  text-muted: "#9ca3af"
  text-inverse: "#ffffff"
  border: "#e5e7eb"
  border-hover: "#d1d5db"
  border-strong: "#9ca3af"
typography:
  display:
    fontFamily: Inter, "Noto Sans JP", "Hiragino Kaku Gothic ProN", system-ui, sans-serif
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter, "Noto Sans JP", "Hiragino Kaku Gothic ProN", system-ui, sans-serif
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: -0.015em
  h2:
    fontFamily: Inter, "Noto Sans JP", system-ui, sans-serif
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.4
  h3:
    fontFamily: Inter, "Noto Sans JP", system-ui, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.45
  body-lg:
    fontFamily: Inter, "Noto Sans JP", system-ui, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75
  body-md:
    fontFamily: Inter, "Noto Sans JP", system-ui, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.7
  body-sm:
    fontFamily: Inter, "Noto Sans JP", system-ui, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.6
  label-md:
    fontFamily: Inter, "Noto Sans JP", system-ui, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
  label-sm:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.45
  label-mono:
    fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace'
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.08em
  caption:
    fontFamily: Inter, "Noto Sans JP", system-ui, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.6
rounded:
  none: 0
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  "2xs": 2px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  "2xl": 48px
  "3xl": 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.sm}"
    padding: 8px 16px
    typography: "{typography.label-md}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: 8px 16px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.text-secondary}"
    padding: 8px 16px
  button-danger:
    backgroundColor: transparent
    textColor: "{colors.text-muted}"
    padding: 8px 16px
  button-danger-hover:
    textColor: "{colors.danger}"
  icon-button:
    backgroundColor: transparent
    textColor: "{colors.text-muted}"
    rounded: "{rounded.sm}"
    size: 32px
  badge:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.full}"
    padding: 5px 8px
    typography: "{typography.label-sm}"
  badge-primary:
    textColor: "{colors.primary}"
  badge-success:
    textColor: "{colors.success}"
  badge-warning:
    textColor: "{colors.warning}"
  badge-danger:
    textColor: "{colors.danger}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-footer:
    backgroundColor: "{colors.surface-alt}"
    padding: 8px 24px
  page:
    backgroundColor: "{colors.bg}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: 8px 16px
    height: 40px
    typography: "{typography.body-md}"
  input-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
  row-hover:
    backgroundColor: "{colors.hover-bg}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  divider-strong:
    backgroundColor: "{colors.border-strong}"
    height: 1px
  outline-button-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
  input-focus-ring:
    backgroundColor: "{colors.primary-ring}"
  card-hover:
    backgroundColor: "{colors.border-hover}"
  dot-accent:
    backgroundColor: "{colors.accent}"
  dot-info:
    backgroundColor: "{colors.info}"
  alert:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: 8px 16px
    height: 44px
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.full}"
    padding: 4px 16px
    typography: "{typography.label-md}"
  chip-active:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary-hover}"
  chat-bubble-user:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.md}"
    padding: 8px 16px
  chat-bubble-assistant:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 8px 16px
  ai-badge:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary-hover}"
    rounded: "{rounded.full}"
    padding: 5px 8px
    typography: "{typography.label-mono}"
---

# Aihackathon Design System

> **Single source of truth for coding agents.** この DESIGN.md はエージェントがプロジェクトのビジュアル言語を一意に理解するためのフォーマット仕様（[DESIGN.md spec](https://github.com/google-labs-code/design.md)）に準拠する。**トークン値は YAML frontmatter が正**。この文書の prose は「なぜそのトークン値なのか」「どう適用するか」を補足する。SCSS 実装 [`app/assets/stylesheets/initializers/_variables.scss`](app/assets/stylesheets/initializers/_variables.scss) は YAML を CSS カスタムプロパティに写したもの。不一致があれば YAML を正とする。

## Overview

3 時間の AI ハッカソンで**即座にプロダクト品質に見える UI** を組み立てるためのシステム。以下の 3 つの軸で設計:

1. **Trust** — 日本語の長文を読ませるプロダクト向けの「新聞的な静けさ」。派手なグラデや絵文字に頼らず、対比と余白で主張する
2. **Density** — 情報量の多い画面でも破綻しない 8px グリッドと Dense List 前提の行設計
3. **AI-Native** — ChatBubble / TokenMeter / PromptCard など AI 表現を一級市民として扱うトークン

Non-Designer's Design Book の **4 原則**（Contrast / Repetition / Alignment / Proximity）をデザイン判断の拠り所とする。SaaS テンプレの「ヒーロー + 3 カード特徴紹介」「カードグリッド一覧」「グラデーション CTA」は**積極的に避ける**。

## Colors

中立的な neutral を基調に、単一のアクセント `primary` が唯一のインタラクション色となる。

- **Primary (#2563eb):** 青のインクトーン。CTA / リンク / アクティブ状態に使用。**1 画面に 1 度だけ**
- **Primary Hover (#1d4ed8):** `primary` のホバー時。単独使用しない
- **Primary Ring (#93c5fd):** focus ring・tint 背景用
- **Accent (#0ea5e9):** データ可視化やハイライトのサブ色
- **Success / Warning / Danger / Info:** セマンティックなフィードバック専用。通常のデザイン要素には使わない
- **Surface (#ffffff):** パネル / カードの地。`surface-alt` は仕切りや tint 面用
- **Bg (#fafafa):** ページ背景。`surface` と**ごく微差**で層構造を示す
- **Text / Text Secondary / Text Muted:** 3 段階のヒエラルキー。これ以上増やさない
- **Border 3 段階:** `border` → `border-hover` → `border-strong` で区別。中間色を作らない

半透明 tint (`success-tint` 等) はテーマごとに `rgba(..., 0.08-0.18)` で運用。テーマ (`data-theme="dusk"`, `data-theme="warm"`) 切替で色合いが丸ごと入れ替わるため、プロダクトは**色を直接参照しない**。必ずトークン経由。

## Typography

Font stack は **Inter + Noto Sans JP** をベースに、和文のフォールバックを `Hiragino Kaku Gothic ProN`, `Hiragino Sans` で担保する。UI モノスペースは SFMono 系。日本語の長文 (`body-lg` / `body-md`) では `line-height` を **1.7 以上**に設定し、見出しは `1.35–1.5` で引き締める。

10 段階の type scale:

| Role | Size | LH | Use |
|------|-----:|---:|-----|
| display | 30px | 1.1 | ヒーロー見出し |
| h1 | 22px | 1.35 | ページタイトル |
| h2 | 18px | 1.4 | セクション見出し |
| h3 | 16px | 1.45 | カードタイトル |
| body-lg | 16px | 1.75 | 長文本文 |
| body-md | 14px | 1.7 | 標準本文 |
| body-sm | 13px | 1.6 | アラート・一覧行 |
| label-md | 12px | 1.5 | フォームラベル |
| label-sm | 11px | 1.45 | バッジ内文字 |
| label-mono | 11px | 1.0 | モノラベル (UPPERCASE) |

**日本語の規約:**
- `word-break: break-all` を全体適用しない（コード等の特定要素のみ）
- `font-feature-settings: "palt"` を本文に適用しない
- 見出しには `word-break: auto-phrase` を適用
- `letter-spacing` は本文 `0`、ラベルは `0.04em–0.2em`

## Layout

**Container Width Ladder**（中途半端な幅を作らない）:

- `460px` — 集中系（ログイン、確認）
- `680px` — フォーム系
- `42em` — 長文プレビュー
- `1200px` — 一覧・詳細 wide

**一覧は Dense List** で実装する。カードグリッド（`auto-fit, minmax`）は **禁止**。`grid-template-columns` で列を切り、40–52px の行高に揃える。

**Density Ladder**:
- Dense（36–40px 行高）: 管理画面のテーブル
- Normal（44–52px 行高）: 標準 Table / Accordion / List
- Comfortable（56–72px 行高）: フォーム、Callout、ヒーロー

## Elevation & Depth

**Tonal Layers** + **Borders** で階層を表現。shadow は最小限。

- 行のホバーは**背景色のみ** — shadow なし
- `shadow-sm`（0 1px 2px / 0.04）— カードの微細な浮き上がり
- `shadow-md`（0 4px 12px / 0.08）— ドロップダウン
- `shadow-lg`（0 12px 32px / 0.12）— モーダル
- Focus ring は `box-shadow: 0 0 0 3px var(--color-primary-ring)` を**唯一**のフォーカス表現として使う

## Shapes

直線基調。**4 段階の `rounded` のみ**使用:

- `sm (4px)` — input, badge-sm, button, chip-item
- `md (8px)` — dropdown, popover, chat-bubble
- `lg (12px)` — card, panel, empty-state
- `full (9999px)` — pill, badge, chip

角丸とシャープを同一 view で**混ぜない**。

## Components

**Ui::** 名前空間配下に **111 コンポーネント**が実装されている（`/styleguide` で確認可能）。主要カテゴリ:

- **Display**: Avatar / AvatarGroup / Badge / Chip / Pill / Tag / Dot / Divider / Stat / Metric / Timestamp / Logo / Heading / HeroText / Label / Legend / Caption / SectionLabel / Kbd / CodeBlock / Quote
- **Layout**: Stack / Inline / Cluster / Grid / Box / Container / Panel / Section / Center / Frame
- **Feedback**: Alert / Toast / Banner / Spinner / Skeleton / Progress / CircularProgress / LoadingDots / InlineMessage / Callout / LoadingOverlay
- **Forms**: TextInput / TextArea / Select / Checkbox / Radio / Switch / Slider / FileUpload / SearchField / ChipRadioGroup / ColorSwatch / Rating / TagInput / FormActions / Fieldset / Field
- **Navigation**: Breadcrumb / Pagination / Tabs / Stepper / SegmentControl / BackLink / NavList / MoreMenu / Anchor / DropdownItem / Navbar
- **Data**: DenseListRow / Table / Accordion / DefinitionList / JsonView / TreeNode / KanbanCard
- **AI-Specific**: ChatBubble / ChatInput / ChatThread / AIBadge / ModelBadge / TokenMeter / TemperatureSlider / PromptCard / StreamingText / MarkdownView / CodeDiff / RetryButton / SafetyBadge / Reasoning / PromptVariable
- **Actions**: Button / IconButton / ButtonGroup / SplitButton / ConfirmButton / CopyButton / CtaBanner
- **Media**: Image / Thumbnail / Gallery / AudioPlayer / Video
- **Utility**: KeyboardShortcut / ColorToken / DiagonalStripes / LoadingBar

**Rails ViewComponent 規約** (`app/components/ui/*_component.rb`):
- 全コンポーネントは `ApplicationComponent` を継承
- state は `.is-*`（1 段）、variation は `data-variant="..."`
- BEM は `.block__element` 形式、`--modifier` 禁止
- マージンは外部制御（コンポーネント内 `margin` 禁止、`gap` で制御）

## Do's and Don'ts

**Do:**
- Primary ボタンを 1 画面 1 個に制限する
- 破壊的操作は Danger スタイル（`text-muted` → `text-danger` on hover、ボーダーなし）
- Dense List（行 grid）で一覧を表現する
- Container width を 460 / 680 / 42em / 1200px のいずれかに揃える
- 全インタラクティブ要素に `cursor: pointer` と 150–300ms transition
- `:focus-visible` を全てに設定（キーボードナビのため）
- 日本語本文の `line-height` を 1.7 以上に
- バッジ・小物 UI は `line-height: 1` + 対称 padding で上下中央揃えを確実に
- `@media (prefers-reduced-motion: reduce)` でアニメーション抑制
- 44×44px 以上のタッチターゲット

**Don't:**
- カードグリッド（`auto-fit, minmax`）で一覧を作らない
- グラデーション背景・グラデ CTA を作らない
- 絵文字をアイコン代わりに使わない（`←` `✓` `🎉` は禁止、SVG のみ）
- 中途半端な max-width（`720px` / `760px`）を作らない
- ヒーロー + 3 カード特徴紹介のランディングを作らない
- 独立したログアウトボタンを置かない（アバターピルのドロップダウンに統合）
- 色だけで状態を伝えない（ドット + ラベル + アイコンで冗長化）
- 1 段階しか違わないグレーを 3 色以上並べない
- HEX / px / rgba をコンポーネント SCSS に直書きしない（必ずトークン経由）
- コンポーネント内の `margin-top` / `margin-bottom`（外部 `gap` で制御）
- `.is-lg` `.is-center` などバリエーションを `.is-*` で表現（`data-variant` を使う）
- `word-break: break-all` を全体適用する
- `font-feature-settings: "palt"` を本文全体に適用する
- 破壊的操作を目立つ赤ボタンで主張する

## References

- **SCSS 実装**: [`app/assets/stylesheets/initializers/_variables.scss`](app/assets/stylesheets/initializers/_variables.scss)
- **Component 実装**: [`app/components/ui/*_component.rb`](app/components/ui/)
- **Styleguide**: `/styleguide`（Rails 起動後に閲覧）
- **詳細ガイドライン**: [`.claude/rules/design/ui-ux.md`](.claude/rules/design/ui-ux.md) / [`.claude/rules/design/principles.md`](.claude/rules/design/principles.md)
- **DESIGN.md 仕様**: <https://github.com/google-labs-code/design.md>
- **Lint**: `npx @google/design.md lint DESIGN.md` で tokens / 参照 / WCAG をチェック
