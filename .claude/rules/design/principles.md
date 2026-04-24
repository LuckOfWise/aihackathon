---
paths: ["app/assets/stylesheets/**", "app/components/**", "app/views/**"]
---

# Design Principles — 普遍デザイン原則

ノンデザイナーズ・デザインブック（Robin Williams）の 4 原則を土台に、sharepage 実績ガイドラインを組み合わせた普遍的な UI/UX 設計ルール。プロジェクト固有の調整は [ui-ux.md](./ui-ux.md) を参照。

## 4 原則

1. **Contrast（対比）** — 要素は「同じ」か「明確に違う」か。中途半端な違いは作らない
2. **Repetition（反復）** — 同じ役割の要素は同じ見た目で繰り返す
3. **Alignment（整列）** — 意図的に整列させる。左揃えを基本
4. **Proximity（近接）** — 関連情報をグループ化、無関係な要素には余白を

## SaaS クリシェ回避（最優先）

| NG パターン | 代替 |
|------------|------|
| カードグリッド（`auto-fill, minmax`）の一覧 | Dense List（grid 行） |
| グラデーション背景 / ボタン | 単色 + ボーダー |
| 絵文字をアイコン代わり（`←` `✓` `🎉`） | SVG アイコン（Lucide） |
| 画像サムネイル前提のカード | テキスト主体の行 |
| でかい中央ヒーロー + 3カード特徴紹介 | 中央集中の単一カラム（460px） + モノスペースラベル |
| 独立したログアウトボタン | アバターピル（名前 + ▾）内ドロップダウン |
| 中途半端な max-width（`720px` `760px`） | 460 / 680 / 42em / フル幅 のみ |
| 破壊的操作を目立つ赤ボタン | テキストリンク風（muted → danger on hover） |

## Container Width Ladder

| 用途 | max-width |
|------|----------|
| 集中系（ログイン、確認） | **460px** |
| フォーム系（作成・編集） | **680px** |
| 本文プレビュー | **42em** |
| 一覧・詳細 | フル幅 |

中途半端な幅を作らない。必ずこの 4 段階に寄せる。

## ボタン階層

1 ページ内で **Primary は 1 つだけ**。

| 種類 | 見た目 | 用途 |
|------|--------|------|
| Primary | 背景色 + 白文字 | 最重要アクション（1 つのみ） |
| Outline | 白背景 + ボーダー | 二次アクション |
| Ghost | 背景なし + テキスト色 | 三次アクション、キャンセル |
| Danger | テキストリンク風（muted → danger on hover） | 破壊的操作、最も控えめに |

削除は詳細画面の最下部（Danger Zone）に置く。

## Dense List

カードグリッドを使わず、`grid-template-columns` で行グリッドを構築。

- 行高: 40–48px
- ホバーは背景色のみ（シャドウなし）
- タイトルは weight 600、抜粋は secondary で nowrap + ellipsis
- 状態（公開範囲など）はドット + ラベルで伝える（色だけに頼らない）
- URL・日付はモノスペース

## インタラクション必須ルール

| ルール | 詳細 |
|--------|------|
| `cursor: pointer` | 全クリッカブル要素に必須 |
| トランジション | 150–300ms。瞬時の状態変化は禁止 |
| `:focus-visible` | `outline: 2px solid var(--color-primary); outline-offset: 2px` |
| Touch target | 最小 44×44px |
| `prefers-reduced-motion` | アニメーション無効化対応 |
| Layout shift 禁止 | `scale`, `translate` で周囲を押さない |

## アイコン

- **SVG のみ**（Lucide を基本セットに）
- 絵文字・テキスト矢印（`←` 等）は不可
- アイコンボタンに `title` 属性でツールチップ
- ストローク幅・サイズを統一

## フォーム

- ラベル: `font-weight: 500; color: var(--color-text-secondary)`
- ヒント: `font-size: 12px; color: var(--color-text-muted)`
- フォームカード: `max-width: 680px; margin: 0 auto`
- 作成時に必要な設定はフォームに含める（後から設定画面に回さない）

## WCAG 2.1 AA

| 要件 | 基準 |
|------|------|
| 主テキスト | 4.5:1 以上 |
| 副テキスト | 3:1 以上 |
| フォーカス状態 | キーボードナビで視認可能 |
| 状態伝達 | 色だけに頼らない（アイコン・テキスト併用） |

## Related

- Good/Bad 具体例: [principles.examples.md](./principles.examples.md)
- プロジェクト固有: [ui-ux.md](./ui-ux.md)
- SCSS 運用: [../styles.md](../styles.md) → `doc/agent/styles.md`
