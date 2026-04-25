# SHINE-MATE デザイン実装指示

元仕様: [face_shine.md](./face_shine.md)
デザインリファレンス: [doc/design/shine-mate/](../design/shine-mate/) (HTML/CSS/JSX プロトタイプ)

**必ずデザインリファレンスの `SHINE-MATE.html` `styles.css` `Screens.jsx` `App.jsx` `AnalysisOverlay.jsx` を読み、トーン&マナーを完全に再現すること**。スクショやレンダリングはせず、ソースを直接読む。

## ブランド

- プロダクト名: **SHINE-MATE**
- サブタイトル: 全日本 AI ハッカソン 2026 · ENTRY №073
- テーマ: 「輝」— 内なる輝きの可視化
- Powered by Claude

## 画面フロー（モバイル 390×844 を基本）

1. **Hero** (`hero`) — ランディング、大型セリフ見出し「Shine from 内側」、ゴールドボタン 1 つ
2. **Upload** (`upload`) — 「原石を、差し出してください。」ドロップゾーン + 3 ヒント (明所/正面/素顔)
3. **Analyzing** (`analyzing`) — FaceMesh オーバーレイ + 進捗 + ライブログ
4. **Result** (`result`) — Before/After スライダー + メトリクス 3 枚
5. **Verdict** (`verdict`) — Claude 鑑定書（ファッション誌風）+ シール + タグ
6. **Match** (`match`) — マッチングアプリカード preview

## デザイントークン（必ず DESIGN.md に反映）

`styles.css` から抽出。これらを `DESIGN.md` のトークンおよび `_variables.scss` に取り込む。既存トークンとの衝突は SHINE-MATE 用に `--shine-*` プレフィックスで逃がしても良い。本機能画面では dark mode 固定（既存ライトテーマとは分離）。

```scss
// Ink family
--shine-ink: #050507;
--shine-ink-2: #0E0E12;
--shine-ink-3: #16161C;

// Bone (text on dark)
--shine-bone: #F5F1E8;
--shine-bone-dim: rgba(245, 241, 232, 0.62);
--shine-bone-mute: rgba(245, 241, 232, 0.38);

// Gold
--shine-gold: #D4AF37;
--shine-gold-soft: #E8C76B;
--shine-gold-deep: #9C7A1F;

// AI accent (cyan)
--shine-ai: #00F2FF;
--shine-ai-dim: rgba(0, 242, 255, 0.32);

// Rose (match action)
--shine-rose: #E8A8B8;

// Lines
--shine-line: rgba(245, 241, 232, 0.08);
--shine-line-2: rgba(245, 241, 232, 0.16);

// Fonts
--shine-serif-en: 'Cormorant Garamond', 'Times New Roman', serif;
--shine-serif-jp: 'Shippori Mincho', 'Yu Mincho', 'Hiragino Mincho ProN', serif;
--shine-sans: 'Inter', 'Noto Sans JP', system-ui, sans-serif;
--shine-mono: 'JetBrains Mono', 'SF Mono', ui-monospace, monospace;
```

Google Fonts を `application.html.erb` に読み込む:
```
Cormorant+Garamond:ital,wght@0,400..600;1,400;1,500
Shippori+Mincho:wght@400..600
Inter:wght@400..700
Noto+Sans+JP:wght@400..600
JetBrains+Mono:wght@400;500
```

## プロジェクトルールとの整合

- **CLAUDE.md / ui-ux.md の普遍ルール**は維持（SaaS クリシェ回避 / カードグリッド禁止 等）
- ただし本機能は **dark luxury プロフィール**として扱い、ブランドカラー (ゴールド + インク + AI シアン) を局所使用
- Container Width Ladder: 460 / 680 / フル幅 を維持（Hero は 390 mobile 寄せ、Desktop では中央寄せ 680px）
- Primary ボタンは各ステージで 1 つのみ（`btn-gold` がそれ）
- BEM: `.shine-mate__` `.shine-hero__` `.shine-upload__` `.shine-analyzing__` `.shine-result__` `.shine-verdict__` `.shine-match__` の Block 分割。1 ファイル = 1 Block を厳守
- `--modifier` 禁止 → `data-variant` / `.is-*` で運用

## 実装範囲（優先順）

### Must（これが無いと機能成立しない）

1. **全 6 ステージの View + Stimulus**
   - `app/views/face_shine/show.html.erb` などで 6 ステージを 1 つの Stimulus stage machine で切替
   - Hero → Upload → Analyzing → Result → Verdict → Match の順で `face_shine_controller` が遷移
   - デザインの JSX ステート (`stage`, `progress`, `logIdx`, `flash`) を TS ステートに翻訳

2. **Hero 画面**
   - 大型 `Cormorant Garamond` italic 見出し「_Shine_ / from / 内側」
   - Shippori Mincho サブライン「其ノ瞳ハ、未ダ磨カレザル」
   - ゴールドドリフトパーティクル (`@keyframes drift`) — `Ui::DecorativeParticles` 相当の純 CSS で再現可
   - Primary: `btn-gold` フルワイズ

3. **Upload 画面**
   - 明朝「原石を、差し出してください。」
   - 破線 + コーナーブラケット付きドロップゾーン
   - 3 ヒントカード (明所/正面/素顔 + Bright/Front/Bare)
   - ファイル選択後、API `/api/face_analyses` へ POST しつつ次画面へ

4. **Analyzing 画面** ←本実装の見せ場
   - デザインの `AnalysisOverlay` をそのまま Stimulus + SVG で再現
   - FaceMesh 478 点（実際には `AnalysisOverlay.jsx` の 58 点で OK）
   - 瞳 × 2 + 歯 × 1 のバウンディングボックス（ゴールド破線 + 四隅ブラケット）
   - 座標ティック (AI シアン)
   - 走査ライン (`@keyframes scanY`)
   - 進捗に応じて mesh → box → labels が段階的に表示 (`meshOpacity` / `boxOpacity` / `labelOpacity` の計算式は JSX から引く)
   - ライブログ: `App.jsx` の `ANALYSIS_LOG` 配列をそのまま再現。タイムスタンプ付き、最新行 fadeUp、色分け (`✓` ゴールド / `▸` AI シアン)
   - 進捗は backend API とダミー進捗の合成（API 完了を待ちつつ 8 秒の演出時間を確保）
   - 完了時に一瞬のホワイトフラッシュ (`@keyframes flash`)

5. **Result 画面**
   - Before/After ドラッガブルスライダー (pointer events, `clip-path: inset(0 X% 0 0)`)
   - ゴールドディバイダー + 円形ハンドル（矢印 SVG）
   - ドラッグ中 / 右寄りで shimmer パーティクル (`@keyframes shimmer`)
   - メトリクス 3 枚 (EYE LUMINANCE / ENAMEL CHROMA / ATTRACT INDEX) — 値は AI スコアから動的生成 (mock 可)
   - Primary: 「AIによる魅力鑑定書を読む →」

6. **Verdict 画面**
   - マガジンマスト「VOL. IX / SHINE-MATE QUARTERLY / 26 / SS」
   - 超大型 serif italic 見出し「_Quiet_ Radiance,」+ 明朝「静カナル、爆発。」
   - ドロップキャップ本文 (AI 生成テキスト / モック可)
   - 署名カード「Claude, c. / MODEL: claude-haiku-4-5」+ 回転破線シール (`@keyframes rotate360`)
   - タグチップ 5 個
   - Primary: 「マッチング画面で輝かせる →」

7. **Match 画面**
   - 3 枚カードスタック（奥 2 枚は薄い、前面はゴールドボーダー + shimmer）
   - 「⟡ SHINE-MATE VERIFIED · GRADE A」バッジ
   - ダミープロフィール（ハルカ, 27 など）
   - アクション行 ✕ / ★ (ゴールド大) / ♥
   - Ghost ボタン「⟲ 別の写真を試す」

### Should（時間が許す範囲で）

- Desktop shell (`DesktopShell`) は**任意**。ハッカソン当日はモバイル表示優先。実装するなら `/face_shine?chrome=1` 等でラップ
- StatusBar 擬似 UI (22:14 + 電波 + バッテリ) — 雰囲気のための装飾、必須ではない
- Phone frame (Dynamic Island + home indicator) — Desktop 表示時のみ、モバイル実機では不要
- キーボード ← → でステージ遷移

### Could (なくても良い)

- Tweaks パネル (デザインツール用、プロダクトには不要)
- Rationale パネル (審査向け説明、別途ランディングにするなら)

## FaceMesh / Overlay の実装

`AnalysisOverlay.jsx` を**ほぼそのまま Stimulus + TS に移植**する。React hooks → `connect()` 時に一度だけ計算、`valueChanged` で再描画。

- SVG viewBox 320×400 (デザイン上の stage サイズ)
- 実画像に重ねるときは、サーバーから返った `face_data` (0–1 正規化座標) を viewBox 座標に掛け戻す or 画像を 320×400 にコンテナフィット
- `progress` value は 0..1 の数値、0.05–0.4 で mesh、0.35–0.6 で box、0.55–0.8 でラベル、0..1 で scan line

デバッグ画面 (`/debug/face_shine`) はこの同じ `AnalysisOverlay` コンポーネントを再利用して、実 API 出力の座標を重ねる。

## スタイルシート構成

```
app/assets/stylesheets/
├── initializers/_variables.scss          # 既存 + SHINE-MATE トークン追記
├── views/_face-shine.scss                # 画面の共通レイアウト
├── views/_shine-hero.scss
├── views/_shine-upload.scss
├── views/_shine-analyzing.scss
├── views/_shine-result.scss
├── views/_shine-verdict.scss
├── views/_shine-match.scss
└── components/_shine-particles.scss      # drift / shimmer アニメ
```

animations (`drift`, `shimmer`, `scanY`, `blink`, `rotate360`, `flicker`, `fadeUp`, `flash`, `pulseHalo`) は `_variables.scss` の最下部か `base/_animations.scss` にまとめて定義。

## ブラウザ挙動

- `body` は `overflow: hidden` しない（モバイルで縦スクロール許容）
- ただし各 stage は `min-height: 100dvh` で固定フィット
- `prefers-reduced-motion` 対応: drift / shimmer / scanY 等のアニメを無効化（必須、CLAUDE.md 準拠）
- iOS Safari の `100vh` 問題回避のため `100svh` / `100dvh` を使う

## 実装分担（再確認）

- **backend エージェント**: API と ActiveAgent は `face_shine.md` の契約のまま。`ShineReviewAgent#comment` のプロンプトは "Editorial / Fashion magazine tone, Shippori Mincho の和文で 2-3 文、`A diamond, mid-cut.` のような英字キーフレーズ混在" を指示する ERB テンプレに更新すること。モデルは `claude-haiku-4-5` でも OK（comment 用なら速度優先）。スコアは `claude-sonnet-4-5` 継続。
- **frontend エージェント**: 上記 6 ステージの View / Stimulus / SCSS。デザインの JSX を直読みして忠実に再現。React 由来の書き方（useRef 等）は TS + Stimulus 流儀に翻訳。

## 参考にしない（避ける）

- `tweaks-panel.jsx` — エディット用、プロダクトに不要
- `DesktopShell` / `RationalePanel` — 審査プレゼン用、実装は Should レベル
- `FacePlaceholder.jsx` — プレースホルダ、実画像に差し替え

## 完了条件（デザイン観点）

- 6 ステージが遷移する
- Analyzing のオーバーレイがデザインと視覚的に一致
- Verdict のタイポグラフィ階層がデザインと一致（Cormorant italic + Shippori Mincho）
- ゴールド / インク / AI シアンのカラートリオが崩れない
- モバイル (390px) で全画面収まる
- Primary ボタンがステージごとに 1 つのみ
