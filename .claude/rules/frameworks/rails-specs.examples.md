# Rails Specs/Testing Rules - Examples

## Principles Examples

### 日本語テスト記述
**Good:**
```ruby
RSpec.describe CorporationLicenseOrder, type: :model do
  describe '.by_control_number' do
    it '新サイトでの注文の場合、id + CONTROL_NUMBER_ADDENDで検索される' do
      corporation_license_order = create(:corporation_license_order)
      control_number = corporation_license_order.id + CorporationLicenseOrder::CONTROL_NUMBER_ADDEND
      expect(CorporationLicenseOrder.by_control_number(control_number)).to include(corporation_license_order)
    end
  end
end
```
**Bad:**
```ruby
RSpec.describe CorporationLicenseOrder, type: :model do
  describe '.by_control_number' do
    it 'returns orders by id + addend when origin_order_id is null' do
      # ...
    end
  end
end
```

### AAAパターン
**Good:**
```ruby
describe '#cancel!' do
  it 'キャンセルするとキャンセル料が発生すること' do
    # Arrange
    user = create(:user)
    reservation = create(:reservation, user: user)

    # Act
    reservation.cancel!

    # Assert
    expect(user.billings.count).to eq 1
    expect(user.billings.first.amount).to eq 500
  end
end
```
**Bad:**
```ruby
describe '#cancel!' do
  before { reservation.cancel! }  # ActをbeforeブロックにContributeしない

  it 'キャンセル料が発生すること' do
    expect(user.billings.count).to eq 1
  end
end
```

### 期待値ベタ書き
**Good:**
```ruby
it '半額を返すこと' do
  cloth = create(:cloth, price: 1000)
  expect(cloth.half_price).to eq 500
end
```
**Bad:**
```ruby
it '半額を返すこと' do
  cloth = create(:cloth, price: 1000)
  expect(cloth.half_price).to eq cloth.price / 2  # テスト対象と同じロジック
end
```

### DSL静的構築
**Good:**
```ruby
describe '#cancelable?' do
  it '利用日が設定されていない場合true' do
    expect(create(:order, activated_on: nil)).to be_cancelable
  end

  it 'すでに利用日になっている場合はfalse' do
    expect(create(:order, activated_on: Date.current)).not_to be_cancelable
  end
end
```
**Bad:**
```ruby
# ループでテストを動的生成（テストが仕様書として読みにくい）
[
  { activated_on: nil, expected: true },
  { activated_on: Date.current, expected: false },
].each do |test_case|
  it "returns #{test_case[:expected]}" do
    order = create(:order, **test_case.except(:expected))
    expect(order.cancelable?).to eq test_case[:expected]
  end
end
```

### モデルスペック・システムスペックのみ
**Good:**
```ruby
# spec/system/admins/articles_spec.rb — システムスペック: OK
describe 'ニュース管理画面', type: :system do
  it '一覧表示できる' do
    visit admins_articles_path
    expect(page).to have_content 'WEB問題集をリリースしました'
  end
end
```
**Bad:**
```ruby
# spec/controllers/articles_controller_spec.rb — コントローラースペック: 禁止
describe ArticlesController, type: :controller do
  describe 'GET #index' do
    it 'returns http success' do
      get :index
      expect(response).to have_http_status(:success)
    end
  end
end
```

### 単純バリデーションテスト不要
**Good:**
```ruby
# カスタムロジックのみテスト
RSpec.describe Order, type: :model do
  describe '#total_price' do
    it '送料込みの合計金額を返すこと' do
      order = create(:order, shipping_fee: 800)
      create(:order_item, order: order, price: 1200, amount: 2)
      expect(order.total_price).to eq 3200
    end
  end
end
```
**Bad:**
```ruby
# 単純なバリデーションのテスト（不要）
RSpec.describe Post, type: :model do
  it { is_expected.to validate_presence_of(:title) }
  it { is_expected.to validate_presence_of(:body) }
  it { is_expected.to belong_to(:user) }
end
```
