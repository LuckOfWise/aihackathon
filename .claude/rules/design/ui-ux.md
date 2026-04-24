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

## プロダクト品質レベル

Linear / Notion / Stripe / Figma 相当の「仕上がり」にするための追加規約。**納品前に全項目確認する**。

### Density Ladder（密度）

用途別に 3 段階。1 画面内で混ぜない。

| 密度 | 行高 / 垂直 padding | 用途 |
|------|---------------------|------|
| **Dense** | 36–40px（`padding: var(--space-sm) 0`） | Dense List の管理画面、表形式の大量データ |
| **Normal** | 44–52px（`padding: var(--space-md) var(--space-lg)`） | 通常の Table / Accordion / List |
| **Comfortable** | 56–72px（`padding: var(--space-lg)` 以上） | 作成フォーム、Callout、ヒーロー領域 |

**Table / Accordion / Dense List はどれも Normal を基本**。Dense にするのは「データ量が多く、情報密度が価値」な画面のみ。

### Vertical Rhythm（垂直リズム）

8px grid に載せる。`margin` / `padding` / `gap` は全て `var(--space-*)`（4 / 8 / 16 / 24 / 32 / 48 / 64）から選択。

| 用途 | 推奨距離 |
|------|----------|
| label → input | `var(--space-xs)` (4px) |
| icon ↔ label（inline） | `var(--space-sm)` (8px) |
| 同一カード内 要素間 | `var(--space-md)` (16px) |
| セクションタイトル → 本文 | `var(--space-md)` (16px) |
| major section 間 | `var(--space-2xl)` (48px) |
| ページセクション間 | `var(--space-3xl)` (64px) |

**内部 margin 禁止の対称原則**: コンポーネント内の子要素は `gap` で間隔制御する。`margin-top` / `margin-bottom` を子要素に持たせない。

### Line-height 選択ガイド

| コンテンツ | line-height |
|-----------|-------------|
| Display / ヒーロー見出し | 1.2–1.35 |
| セクション見出し (H2/H3) | 1.4–1.5 |
| 本文 (段落) | 1.7–1.85 |
| UI 要素内テキスト (Badge / Button / Input label) | 1.0–1.5（背景 / padding と合わせて中央揃いになるよう） |
| 日本語の長文（`<p>`） | 1.75–1.85 |

### 要素内 padding と文字中央揃い

- バッジや小 pill（高さ 20–24px）は `padding` と `line-height` を**ペアで指定**。`line-height` 未指定だとブラウザデフォルト 1.5 で上下非対称になる
- 推奨: `padding: var(--space-2xs) var(--space-sm); line-height: 1.45;`
- input 系（checkbox / radio / switch）はラッパーに `line-height: 1` を指定してテキストと中央揃い

### Proximity（近接）原則

- 関連する情報は**`var(--space-sm)` 以下**でグループ化
- 異なるグループ同士は**`var(--space-lg)` 以上**で分離
- 中途半端な距離（12px / 20px / 28px）は作らない — トークンにある値だけ使う

### Contrast（対比）原則

- 要素は「同じ」か「明確に違う」か。微妙に違うグレーを 3 段階以上並べない
- font-weight は 400 / 500 / 600 / 700 のみ使用（中間値禁止）
- font-size は `--text-*` トークンの 10 段階のみ使用
- border 色は `--color-border` / `--color-border-hover` / `--color-border-strong` の 3 段階のみ

### Repetition（反復）原則

- 同じ役割の要素は**必ず同じコンポーネント**を使う（Ad-hoc CSS 禁止）
- 「似たボタン」「似たカード」が並んだら `data-variant` で切り替え可能か検討
- `box-shadow` / `transition` / `border-radius` は全てトークン経由

### プロダクト品質チェックリスト（納品直前）

**密度 & リズム**
- [ ] 1 画面内で density 段階を混ぜていない
- [ ] padding / margin / gap が全て `var(--space-*)` 経由
- [ ] 内部 margin を持ったコンポーネントがない（`gap` で制御）
- [ ] `margin-top` / `margin-bottom` を個別要素に当てていない（`& + &` と `flex-direction: column` + `gap` で対処）

**整列 & 中央揃い**
- [ ] Dense 系 table / list の `td/th` に `vertical-align: middle`
- [ ] checkbox / radio / switch のラッパーに `line-height: 1`
- [ ] バッジ類に `line-height` 明示済（デフォルト 1.5 に依存しない）
- [ ] grid の dt/dd は `align-items: baseline`

**フォーカス & 状態**
- [ ] `:focus-visible` で `--ring-focus` 適用
- [ ] `:hover` で 150-300ms のトランジション
- [ ] `.is-loading` / `.is-active` / `.is-disabled` の 3 状態を実装
- [ ] disabled 状態で `cursor: not-allowed`

**タイポグラフィ**
- [ ] font-size は 10 段階から選択（`--text-2xs`..`--text-3xl`）
- [ ] font-weight は 4 段階から選択（`--weight-regular`..`--weight-bold`）
- [ ] 本文の line-height は 1.7 以上
- [ ] 見出しの line-height は 1.35–1.5

**カラー & 階層**
- [ ] テキストは `--color-text` / `--color-text-secondary` / `--color-text-muted` の 3 段階
- [ ] ボタン階層は Primary 1 / Outline / Ghost / Danger のみ
- [ ] 破壊的操作は Danger スタイル（テキストリンク風）
- [ ] tint 背景は必ずトークン（`--color-*-tint`）経由

**a11y**
- [ ] WCAG AA の 4.5:1（主テキスト）/ 3:1（副）
- [ ] SVG アイコンに `aria-hidden="true"` or `title`
- [ ] インタラクティブ要素に 44×44px のヒット領域
- [ ] `prefers-reduced-motion` でアニメーション抑制

## コンポーネントカタログ

`app/components/ui/` 配下に用意された ViewComponent 群を用途別に整理。`/styleguide` で実物が確認できる。

### Display / 表示

| Component | 用途 | 備考 |
|-----------|------|------|
| `Ui::HeadingComponent` | 見出し (`level: 1..3`) | SaaSクリシェのデカ見出しは避ける |
| `Ui::HeroTextComponent` | ランディングの集中見出し (460px) | 1ページに1つ |
| `Ui::LabelComponent` | 小型ラベル | フォーム外でも使える |
| `Ui::SectionLabelComponent` | mono UPPER のセクション見出し | Gap を作る時に |
| `Ui::CaptionComponent` | 補足説明 | Figure等 |
| `Ui::AvatarComponent` | 円形アバター（initial or image） | `size: :sm/:md/:lg` |
| `Ui::AvatarGroupComponent` | 複数アバター重ね表示 | |
| `Ui::ChipComponent` | ラベル（選択状態あり） | フィルタUI |
| `Ui::PillComponent` | 数値/タグ用の丸み大 | |
| `Ui::TagComponent` | 角丸小 | 複数並べる用 |
| `Ui::DotComponent` | ステータスドット | 色だけに頼らない |
| `Ui::DividerComponent` | 水平/垂直の線 | margin は外部制御 |
| `Ui::KbdComponent` | `⌘K` 等キーボードキー | |
| `Ui::CodeBlockComponent` | 等幅 multi-line | |
| `Ui::QuoteComponent` | 引用 / 注釈 | |
| `Ui::StatComponent` | KPI 大きな数字 | |
| `Ui::MetricComponent` | ラベル + 値 + 増減 | |
| `Ui::TimestampComponent` | 相対時間 + absolute tooltip | |
| `Ui::LogoComponent` | ブランドロゴ (mark + wordmark) | |
| `Ui::LegendComponent` | 凡例 | Chart 用 |

### Layout / レイアウト

| Component | 用途 |
|-----------|------|
| `Ui::StackComponent` | 縦方向スタック (`gap`指定) |
| `Ui::InlineComponent` | 横方向並び |
| `Ui::ClusterComponent` | 折り返し対応横並び |
| `Ui::GridComponent` | `auto-fit` でない明示列 grid |
| `Ui::BoxComponent` | 汎用 Box (padding/bg) |
| `Ui::ContainerComponent` | 幅決めコンテナ (460/680/42em/1200) |
| `Ui::PanelComponent` | 枠付きパネル |
| `Ui::SectionComponent` | セクション構造 |
| `Ui::CenterComponent` | 垂直/水平中央寄せ |
| `Ui::FrameComponent` | アスペクト比保持 |

### Feedback / フィードバック

| Component | 用途 |
|-----------|------|
| `Ui::ToastComponent` | 一時通知 |
| `Ui::BannerComponent` | ページ幅帯メッセージ |
| `Ui::InlineMessageComponent` | インライン補助メッセージ |
| `Ui::CalloutComponent` | 強調ボックス |
| `Ui::SpinnerComponent` | ローディング |
| `Ui::SkeletonComponent` | プレースホルダー |
| `Ui::ProgressComponent` | 水平進捗 |
| `Ui::CircularProgressComponent` | 円形進捗 |
| `Ui::LoadingDotsComponent` | ドット 3 つ点滅 |
| `Ui::LoadingOverlayComponent` | 全面オーバーレイ |

### Forms / 入力

| Component | 用途 |
|-----------|------|
| `Ui::TextInputComponent` | input[type=text] 単体 |
| `Ui::TextAreaInputComponent` | textarea 単体 |
| `Ui::SelectInputComponent` | select 単体 |
| `Ui::CheckboxInputComponent` | Checkbox (label + input) |
| `Ui::RadioInputComponent` | Radio 単体 |
| `Ui::SwitchComponent` | on/off トグル |
| `Ui::SliderComponent` | range input |
| `Ui::RatingComponent` | 星評価 |
| `Ui::FileUploadComponent` | ファイルアップロード (dropzone 風) |
| `Ui::SearchFieldComponent` | 検索欄（虫眼鏡 + input） |
| `Ui::TagInputComponent` | Enter 区切りタグ入力 |
| `Ui::ChipRadioGroupComponent` | Chip 型ラジオ選択 |
| `Ui::ColorSwatchComponent` | カラー選択 |
| `Ui::FormActionsComponent` | 右寄せボタン群 |
| `Ui::FieldsetComponent` | 論理グループ |

### Navigation / ナビ

| Component | 用途 |
|-----------|------|
| `Ui::BreadcrumbComponent` | パンくず |
| `Ui::PaginationComponent` | ページネーション |
| `Ui::TabsComponent` | タブ切替 |
| `Ui::StepperComponent` | 進行ステッパー |
| `Ui::SegmentControlComponent` | セグメント切替 |
| `Ui::BackLinkComponent` | 戻るリンク（icon） |
| `Ui::NavListComponent` | 縦ナビ |
| `Ui::MoreMenuComponent` | 三点メニュー |
| `Ui::AnchorComponent` | セクション内リンク |
| `Ui::DropdownItemComponent` | ドロップダウン項目 |

### Data / データ

| Component | 用途 |
|-----------|------|
| `Ui::DenseListRowComponent` | Dense List 行 |
| `Ui::TableComponent` | 基本 table |
| `Ui::AccordionComponent` | Accordion 親 |
| `Ui::AccordionItemComponent` | Accordion 子 |
| `Ui::DefinitionListComponent` | dl/dt/dd |
| `Ui::JsonViewComponent` | JSON pretty view |
| `Ui::TreeNodeComponent` | ツリーノード |
| `Ui::KanbanCardComponent` | Kanban カード |

### AI-Specific / AI向け

**重要: ハッカソンの本体はここ。**

| Component | 用途 |
|-----------|------|
| `Ui::ChatBubbleComponent` | チャット吹き出し (`role: :user/:assistant`) |
| `Ui::ChatInputComponent` | チャット入力欄 + 送信 |
| `Ui::ChatThreadComponent` | スレッド全体 |
| `Ui::AiBadgeComponent` | 「AI生成」マーク |
| `Ui::ModelBadgeComponent` | モデル名表示 |
| `Ui::TokenMeterComponent` | トークン使用量 |
| `Ui::TemperatureSliderComponent` | 温度調整 |
| `Ui::PromptCardComponent` | プロンプトテンプレ |
| `Ui::StreamingTextComponent` | ストリーミング表示 |
| `Ui::MarkdownViewComponent` | Markdown レンダ |
| `Ui::CodeDiffComponent` | diff 表示 |
| `Ui::RetryButtonComponent` | 再生成ボタン |
| `Ui::SafetyBadgeComponent` | 安全性表示 |
| `Ui::ReasoningComponent` | 推論過程 expandable |
| `Ui::PromptVariableComponent` | 変数スロット |

### Actions / アクション

| Component | 用途 |
|-----------|------|
| `Ui::ButtonComponent` | Primary/Outline/Ghost/Danger |
| `Ui::IconButtonComponent` | 単一アイコンボタン |
| `Ui::ButtonGroupComponent` | 水平ボタン群 |
| `Ui::SplitButtonComponent` | 分割ボタン |
| `Ui::ConfirmButtonComponent` | 確認ダイアログ付き |
| `Ui::CopyButtonComponent` | クリップボード copy |
| `Ui::CtaBannerComponent` | CTA バナー |

### Media / メディア

| Component | 用途 |
|-----------|------|
| `Ui::ImageComponent` | aspect保持 img |
| `Ui::ThumbnailComponent` | 小サムネ |
| `Ui::GalleryComponent` | 画像グリッド |
| `Ui::AudioPlayerComponent` | 音声プレイヤー |
| `Ui::VideoComponent` | video wrapper |

### Utility / ユーティリティ

| Component | 用途 |
|-----------|------|
| `Ui::KeyboardShortcutComponent` | `⌘K` 等複数キー表示 |
| `Ui::ColorTokenComponent` | styleguide 用色見本 |
| `Ui::DiagonalStripesComponent` | プレースホルダー縞 |
| `Ui::LoadingBarComponent` | ページ上部 loading bar |

## コンポーネント選定ガイド

**迷ったら**:

- データを見せたい → カード ❌ / Dense List ✅
- 数値を強調したい → `Stat` or `Metric`
- AI応答を見せたい → `ChatBubble` + `Card` の中に `MarkdownView`
- 状態を伝えたい → `Dot` + `Badge`（色だけに頼らない）
- 選択肢を見せたい → 3個以内なら `ChipRadioGroup`、4個以上は `SelectInput`
- 作業中を伝えたい → 短い:`Spinner` / 予測可能:`Progress` / 不定:`LoadingDots`

## 命名規則

- Component クラス: `Ui::{名詞}Component` / `Ui::{名詞}{種別}Component`
- SCSS Block: `.{kebab-case-name}` (= Block 名)
- Modifier は `data-variant="..."`（`--modifier` 禁止）
- State は `.is-*` 1 段のみ（`.is-active` `.is-loading`）

## Examples

詳細: [ui-ux.examples.md](./ui-ux.examples.md)
