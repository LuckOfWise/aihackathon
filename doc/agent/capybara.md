# Capybaraテストガイドライン

> **注意**: このプロジェクトでは現在システムスペック（Capybara）を使用していません。
> このガイドラインは将来システムスペックを導入する際の参考として残しています。
> 現在のテスト戦略については `spec.md` を参照してください。

## テスト環境のデフォルト設定

### JavaScriptはデフォルトで有効
```ruby
# AI: デフォルトでChromeドライバーを使用するため、:jsオプションは不要
RSpec.describe 'パスワードリセット', type: :system do  # :jsオプション不要
  it 'JavaScriptが自動的に有効' do
    # JavaScript依存の動作も問題なくテスト可能
  end
end

# AI: rack_testモードは使用しない（明示的な指示がある場合のみ）
# 理由: JavaScript有効なChromeドライバーで統一することで、
# 実際のユーザー環境に近い状態でテストを実行できる
```

## 要素選択の優先順位

### 1. テキストコンテンツでの検証（最優先）
```ruby
# AI: テキストコンテンツで十分な場合は、have_contentを使用
expect(page).to have_content('ページが見つかりません')
expect(page).to have_content('登録が完了しました')
click_button '送信'
click_link 'ホームへ戻る'

# AI: withinブロックでもテキストで絞り込み可能
within('section', text: 'コメント一覧') do
  expect(page).to have_content('最初のコメント')
end
```

### 2. セマンティックな属性（name, label）
```ruby
# AI: フォーム要素はname属性やlabelで特定
fill_in 'user[email]', with: 'test@example.com'
fill_in 'メールアドレス', with: 'test@example.com'
choose 'プレミアムプラン'
select '東京都', from: '都道府県'
```

### 3. data-test-selector属性（テキストで特定困難な場合のみ）

**重要**: `data-testid`の使用は禁止です。必ず`data-test-selector`属性を使用してください。

```erb
<!-- AI: 動的コンテンツや複雑なUIコンポーネントに使用 -->
<!-- NG: data-testidは使用禁止 -->
<!-- <div data-testid="image-upload-area"> ← 使用禁止 -->

<!-- OK: data-test-selectorで統一 -->
<div data-test-selector="image-upload-area">
  <%= file_field_tag :image %>
</div>
```

```ruby
# AI: テキストコンテンツがない/変動する要素の場合に使用
within(:data_test, 'image-upload-area') do
  attach_file 'image', test_image_path
end
```

## data-test-selector属性の使用場面

### 推奨される使用場面
```ruby
# AI: アイコンボタンなどテキストがない要素
click_button :data_test, 'delete-icon'

# AI: 動的に生成されるコンテンツエリア
within(:data_test, 'notifications-container') do
  expect(page).to have_selector('.notification', count: 3)
end

# AI: 複雑なUIコンポーネント（モーダル、ドロップダウンなど）
within(:data_test, 'user-settings-modal') do
  fill_in 'プロフィール', with: '新しい自己紹介'
end
```

## 繰り返し要素の選択戦略

### 共通のdata-test-selector + textで十分な場合（推奨）
```ruby
# AI: 繰り返し要素には共通のdata-test-selectorを使用し、textで特定
# 例：コメント一覧での個別コメントの操作
within(:data_test, 'comment-item', text: '初期コメント') do
  accept_confirm do
    find(:data_test, 'delete-comment').click
  end
end

# AI: ユーザー一覧での個別ユーザーの編集
within(:data_test, 'user-row', text: 'user@example.com') do
  click_link '編集'
end
```

### ユニークなdata-test-selectorが必要な場合
```ruby
# AI: 複雑な条件や動的コンテンツの場合のみユニークIDを使用
within(:data_test, "comment-#{comment.id}") do
  # 複雑な操作
end
```

**判断基準**：
- テキストや他の属性で一意に特定できる → 共通セレクタ + text
- 動的に生成される複雑な要素 → ユニークセレクタ

## フォーム入力のセレクタ優先順位

### fill_in等でのセレクタ選択指針
```ruby
# AI: 1. name属性を優先（HTMLセマンティクスに沿い、変更されにくい）
fill_in 'user[email]', with: 'test@example.com'
fill_in 'post[content]', with: '投稿内容のテキスト'

# AI: 2. label要素による指定（ユーザビリティと連動し、意味が明確）
fill_in 'メールアドレス', with: 'test@example.com'
fill_in 'タイトル', with: 'サンプルタイトル'

# AI: 3. data-test-selector属性（上記が使えない場合）
fill_in :data_test, 'custom-input', with: '入力値'
```

### 避けるべき方法と理由
```ruby
# AI: NG - data-testidは使用禁止（data-test-selectorで統一）
find('[data-testid="submit-btn"]').click  # NG
within('[data-testid="form"]') do  # NG
  # 処理
end

# AI: NG - data-test-selector属性を直接CSSセレクタとして使用するのも禁止
within('[data-test-selector="follows-grid"]') do  # NG - 直接属性セレクタは使用禁止
  # 処理
end
find('[data-test-selector="button"]').click  # NG

# AI: OK - 必ず:data_testカスタムセレクタを使用
within(:data_test, 'follows-grid') do  # OK
  # 処理
end
find(:data_test, 'button').click  # OK

# AI: NG - CSSクラスはスタイル変更で壊れる
find('.btn-primary').click
expect(page).to have_selector('.error-message')  # NG

# AI: NG - IDは構造変更の影響を受けやすい
find('#user_email').set('x')

# AI: NG - DOM構造に依存し保守困難
find('div > form > input').set('x')

# AI: 代わりにテキストコンテンツやdata-test-selectorを使用
click_button '送信'  # OK - テキストで特定
expect(page).to have_content('エラーが発生しました')  # OK
find(:data_test, 'email-input').set('test@example.com')  # OK - :data_testカスタムセレクタ使用
```

## 非同期処理の待機
```ruby
it '画像のアップロード' do
  attach_file :data_test, 'image-upload', test_image_path
  expect(page).to have_selector(:data_test, 'image-preview', wait: 5)
end
```
