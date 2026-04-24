# Rails-Turbo Rules - Examples

## Principles Examples

### X-Flash-Messagesヘッダー
**Good:**
```ruby
# コントローラー側
def flash_turbo_frame
  return if response.redirect?
  json = JSON.generate(flash.to_h, ascii_only: true)
  response.set_header('X-Flash-Messages', json)
end
```
```javascript
// JS側 - Turboフレームレスポンスからflashを取得
document.addEventListener('turbo:before-fetch-response', (event) => {
  const json = event.detail.fetchResponse.header('X-Flash-Messages')
  if (!json) return
  const flashData = JSON.parse(json)
  if (flashData.notice) notifySuccess(flashData.notice)
  if (flashData.alert) notifyError(flashData.alert)
})
```
