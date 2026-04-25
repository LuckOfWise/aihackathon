# 「輝」フォトエンハンサー機能 — 実装仕様

## 1. 概要

撮影 / アップロードした **人物写真の目と歯だけを輝かせる** 加工機能。

**コンセプト**: AI で画像生成すると本人と別人になるため、**Claude Vision で顔ランドマークを座標として取得し、ブラウザの Canvas で該当領域だけ局所的に加工する**。本人らしさを保ったままの "盛り" を実現する。

ハッカソンテーマ「輝」の体現。

## 2. 機能要件

### 必須機能

1. **画像入力**: ファイルアップロード（撮影方式は UI チームの設計に従う、機能実装上はファイル入力で OK）
2. **顔ランドマーク検出**: AI が目・歯の座標を返す
3. **強度オートレコメンド**: AI が写真から推奨強度を提案
4. **ローカル合成**: ブラウザ Canvas で目・歯にエフェクト合成
5. **強度切替**: 控えめ / 標準 / キラキラ の 3 段階（AI 再呼出なしで即座に再合成）
6. **輝きコメント生成**: AI が加工後画像を見てコメント生成（ストリーミング表示）
7. **輝度スコア**: AI が Before/After を見て輝度向上を採点
8. **品質自己検証**: キラキラ時のみ加工後を AI で再評価し、不自然なら再合成（最大2回）
9. **失敗時の AI アドバイス**: 顔検出失敗時に AI が原因と対策をコメント
10. **ローカルダウンロード**: 加工結果をクライアントから直接ダウンロード
11. **デバッグ画面**: 検出座標を画像上にオーバーレイ表示（development のみ）

### 非機能要件

- DB 永続化なし（ステートレス API）
- 認証不要
- 加工処理はクライアント完結（サーバーは AI 呼出のみ）
- 画像はサーバー側に保存しない（メモリ上で AI に渡してそのまま破棄）

### 対象範囲

- **1人**の正面寄り写真のみ対象（複数人検出時は最も confidence の高い顔のみ加工）
- 横顔・斜め過ぎる顔は confidence で弾く

## 3. AI Agent 構成

ActiveAgent (`app/agents/`) で 3 体構成。LLM はすべて `claude-sonnet-4-5`。

### 3.1 `FaceLandmarkAgent`（元画像を見る）

| Action | 入力 | 出力 | 用途 |
|---|---|---|---|
| `detect` | 画像 (base64) | 顔ランドマーク JSON | 座標検出 |
| `recommend_intensity` | 画像 (base64) | `subtle` / `standard` / `sparkle` + 理由 | 初期強度推奨 |
| `advise_retake` | 画像 (base64) + 失敗理由 | アドバイス文 | 失敗時 |

**`detect` の出力スキーマ**:
```json
{
  "image_size": { "width": 1024, "height": 768 },
  "face": {
    "confidence": 0.0-1.0,
    "bounding_box": { "x": 0.0-1.0, "y": 0.0-1.0, "w": 0.0-1.0, "h": 0.0-1.0 },
    "eyes": {
      "left":  { "state": "open|closed", "iris_center": {"x":..,"y":..}, "iris_radius": 0.0-1.0, "eye_polygon": [{"x":..,"y":..}, ...] },
      "right": { ...同上... }
    },
    "mouth": {
      "state": "open_showing_teeth|open_no_teeth|closed",
      "teeth_polygon": [{"x":..,"y":..}, ...] | null
    }
  } | null
}
```

座標はすべて **0–1 正規化**（画像サイズ非依存）。

### 3.2 `ShineReviewAgent`（加工後画像を見る）

| Action | 入力 | 出力 | 用途 |
|---|---|---|---|
| `comment` | 加工後画像 (base64) | コメント文（ストリーミング） | 輝きどころを言語化 |
| `score` | 元画像 + 加工後画像 (base64×2) | `{ score: 0-100, summary: string }` | 輝度スコア |
| `validate_quality` | 加工後画像 (base64) | `{ ok: boolean, issues: [string] }` | 不自然さ検証 |

### 3.3 プロンプト方針

- **段階的推論**: bounding box → 細部、と段階を踏ませる
- **JSON schema 強制**: tool 機能で structured output
- **画像は長辺 1024px に正規化してから渡す**（座標解釈のブレ防止）
- **Few-shot を必要に応じて埋め込む**（精度を見て判断）
- ERB テンプレートで管理（プロンプトの Ruby 直書き禁止）

## 4. パイプライン

```
[画像アップロード]
        ↓
[クライアント: 長辺1024pxに圧縮 → base64化]
        ↓
[サーバー: 並列AI呼出]
  ├─ FaceLandmarkAgent#detect
  └─ FaceLandmarkAgent#recommend_intensity
        ↓
  [失敗時]: FaceLandmarkAgent#advise_retake → エラー画面で表示
        ↓
[クライアント: Canvas合成 (推奨強度で初期描画)]
        ↓
[サーバー: 並列AI呼出]
  ├─ ShineReviewAgent#comment (streaming)
  ├─ ShineReviewAgent#score
  └─ ShineReviewAgent#validate_quality (キラキラ時のみ)
        ↓
  [validate NG]: パラメータ微調整 → 再合成 → 再validate (最大2回)
        ↓
[結果表示: 画像 + コメント + スコア + ダウンロード + 強度切替UI]
        ↓
[強度切替時]: Canvas再合成のみ (AI再呼出なし)
```

## 5. エフェクト合成仕様（クライアント Canvas）

| 強度 | 目: キャッチライト | 目: 彩度補正 | 歯: ホワイトニング | スプライト ✨ |
|---|---|---|---|---|
| **subtle** | 不透明度 25%、虹彩半径×0.30 の白円 | なし | 明度 +5、黄味 -3 | なし |
| **standard** | 不透明度 50%、虹彩半径×0.35 | 彩度 +8% | 明度 +10、黄味 -8 | なし |
| **sparkle** | standard と同じ | standard と同じ | standard と同じ | 目尻×2 + 歯中央×1 |

**スキップ条件**:
- `eyes.*.state == "closed"` → 該当目の加工スキップ
- `mouth.state != "open_showing_teeth"` → 歯の加工スキップ
- `face.confidence < 0.7` → 警告 + 加工は実行
- 多角形面積が画像比 0.1% 未満 → 該当部位スキップ

数値は実装側で実機確認しながら微調整可。

## 6. API 設計

純 JSON、ステートレス。

```
POST /api/face_analyses
  Content-Type: multipart/form-data
  Body: file=<image>
  Response 200:
    {
      "landmarks": { ...FaceLandmarkAgent#detect の出力... },
      "recommended_intensity": "subtle|standard|sparkle",
      "intensity_reason": "..."
    }
  Response 422:
    {
      "error": "no_face_detected" | "low_confidence" | "multiple_faces",
      "advice": "FaceLandmarkAgent#advise_retake の出力"
    }
```

```
POST /api/shine_reviews
  Content-Type: multipart/form-data
  Body:
    original_file=<image>
    shined_file=<image>
    intensity=<string>
    validate=<boolean>  # キラキラ時のみ true
  Response 200 (Server-Sent Events):
    event: comment_chunk    data: { "text": "..." }
    event: score            data: { "score": 87, "summary": "..." }
    event: validate         data: { "ok": true, "issues": [] }
    event: done             data: {}
```

ルーティング:
```ruby
namespace :api do
  resources :face_analyses, only: :create
  resources :shine_reviews, only: :create
end
```

## 7. ディレクトリ構成

```
app/
├── agents/
│   ├── face_landmark_agent.rb
│   └── shine_review_agent.rb
├── controllers/
│   └── api/
│       ├── face_analyses_controller.rb
│       └── shine_reviews_controller.rb
├── views/
│   └── agents/
│       ├── face_landmark_agent/
│       │   ├── detect.text.erb
│       │   ├── recommend_intensity.text.erb
│       │   └── advise_retake.text.erb
│       └── shine_review_agent/
│           ├── comment.text.erb
│           ├── score.text.erb
│           └── validate_quality.text.erb
└── frontend/
    ├── controllers/
    │   ├── face_shine_controller.ts        # 全体ステートマシン
    │   ├── canvas_compositor_controller.ts # face_data + intensity → Canvas
    │   ├── intensity_selector_controller.ts
    │   └── download_controller.ts
    └── lib/
        ├── compose.ts            # 加工アルゴリズム本体（純関数）
        └── image_resize.ts       # 長辺1024px圧縮
```

## 8. デバッグ画面 (`/debug/face_shine`)

- development のみ有効（`Rails.env.development?` でガード）
- 画像アップロード入力
- 元画像の上にオーバーレイ表示:
  - 顔 bbox（緑実線）
  - 目 polygon（赤実線）
  - 虹彩中心（青塗り円）
  - 歯 polygon（黄実線）
- 各要素の confidence / state ラベル
- 生 JSON を `<details>` で折りたたみ表示
- 強度切替・コメント表示は不要（座標精度確認専用）

## 9. 実装上の注意

### 必ず守ること

- **`app/services/` を作らない**: ロジックはモデル / Form Object / Agent に
- **プロンプトを Ruby に直書きしない**: 必ず ERB テンプレート
- **API key は credentials 経由**: `config/active_agent.yml` に平文禁止
- **画像をサーバーに保存しない**: メモリ上で AI に渡してそのまま破棄
- **クライアントで長辺 1024px に圧縮してから送信**: ペイロード削減と AI 座標精度の両立
- **JSON schema を tool function で強制**: パース失敗を防ぐ
- **座標範囲外チェック**: 0–1 範囲外、polygon の自己交差等はサーバーで検証してフィルタ

### パフォーマンス

- 並列 AI 呼出は `Async` gem または `Thread.new` で実装（要 GVL 確認）
- ストリーミングは Rails の `ActionController::Live` + SSE
- 画像 base64 化はクライアント側で行う

### 失敗時の挙動

| ケース | 振る舞い |
|---|---|
| 顔未検出 | 422 + advise_retake 文を返す |
| confidence < 0.7 | 警告フラグ付きで 200、加工は実行 |
| 目を閉じている | 目の加工スキップ、トーストで通知 |
| 口を閉じている | 歯の加工スキップ |
| AI タイムアウト | 500、フロントは再試行ボタン表示 |
| ファイルサイズ過大 | クライアント圧縮で防御、保険でサーバー側 5MB 制限 |

## 10. テスト方針

ハッカソン速度優先のため最小限:
- **model spec**: 不要（モデルなし）
- **agent spec**: モック応答で各 action のパース動作を確認（任意）
- **system spec**: `/debug/face_shine` で画像アップロード→オーバーレイ表示までを 1 ケースだけ確認（任意）
- 手動確認: `/debug/face_shine` で実画像 5〜10 枚試して座標精度を見る

## 11. UI 連携

UI（本番画面）は別チームが設計中。本実装では以下のインターフェースを提供:

- API エンドポイント（上記 6.）
- Stimulus controller の **公開イベント / アクション**（UI チームと別途擦り合わせ）
- `lib/compose.ts` の **純関数**（face_data + intensity + 元画像 → 加工後画像）

UI チームは合成済み画像と AI コメント・スコアを受け取って表示するだけで済む構造にする。

## 12. 未確定事項（実装中に判断 OK）

- プロンプトの具体文言（精度を見ながら調整）
- エフェクト合成の細部数値（実機で見ながら調整）
- ストリーミング失敗時のフォールバック（一括取得に倒す等）
- 並列 AI 呼出の実装方式（`Async` vs `Thread.new`）
