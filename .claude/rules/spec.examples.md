# Spec Rules - Examples

## Project-specific Examples

### FactoryBot の :user が全員 example.com を共有する
**Bad:**
```ruby
# 両方とも user<n>@example.com で生成されるため、owner.same_domain?(viewer) が true になってしまう
it "domain visibility でアクセス可なこと" do
  owner = create(:user)
  viewer = create(:user)
  document = create(:document, user: owner, visibility: :invited_only)
  # 意図: 別ドメインの viewer は見れないはず
  expect(document.accessible_by?(viewer)).to be false
end
```
**Good:**
```ruby
it "domain visibility でアクセス不可なこと" do
  owner = create(:user, email: "owner@example.com")
  viewer = create(:user, email: "viewer@other.test")
  document = create(:document, user: owner, visibility: :invited_only)
  expect(document.accessible_by?(viewer)).to be false
end
```

### TimeHelpers を使わない upsert 冪等性テスト
```ruby
# travel_to は include されていないので、factory で古いタイムスタンプを仕込む
it "同じユーザーで複数回呼び出しても DocumentAccess は 1 件のまま last_accessed_at が更新されること" do
  document = create(:document)
  viewer = create(:user)

  create(:document_access, user: viewer, document: document, last_accessed_at: 1.day.ago)
  first_access = DocumentAccess.find_by!(user: viewer, document: document)
  original_created_at = first_access.created_at
  original_last_accessed_at = first_access.last_accessed_at

  expect { document.record_access_by!(viewer) }.not_to change(DocumentAccess, :count)

  reloaded = first_access.reload
  expect(reloaded.last_accessed_at).to be > original_last_accessed_at
  expect(reloaded.created_at.to_i).to eq original_created_at.to_i
end
```
