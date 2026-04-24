# Stimulus Rules - Examples

## Principles Examples

### プログレッシブエンハンスメント
**Good:**
```javascript
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['toggle', 'showWhenOn', 'hideWhenOn']

  connect() {
    this.toggle()
  }

  toggle() {
    if (this.toggleTarget.checked) {
      this.showWhenOnTargets.forEach((el) => el.classList.remove('d-none'))
      this.hideWhenOnTargets.forEach((el) => el.classList.add('d-none'))
    }
  }
}
```

### Turbo Stream連携
```javascript
import { renderStreamMessage } from "@hotwired/turbo"

export default class extends Controller {
  static targets = ['fetching']

  connect() {
    this.fetchingTargets.forEach((elm) => {
      const { url } = elm.dataset
      if (url && url !== '') {
        this.#fetchWithTurboStream(url)
      }
    })
  }

  #fetchWithTurboStream(url) {
    fetch(url, { headers: { 'Accept': 'text/vnd.turbo-stream.html' } })
      .then(response => response.text())
      .then(message => renderStreamMessage(message))
  }
}
```

### disconnect()でクリーンアップ
**Good:**
```javascript
export default class extends Controller {
  connect() {
    this.observer = new MutationObserver(() => this.#update())
    this.observer.observe(this.element, { childList: true, subtree: true })
  }

  disconnect() {
    this.observer?.disconnect()
  }
}
```
