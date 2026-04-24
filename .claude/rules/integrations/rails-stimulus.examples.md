# Rails-Stimulus Integration Rules - Examples

## Principles Examples

### TypeScript型宣言

**Good:**
```typescript
export default class extends Controller {
  static targets = ['input', 'output']
  static values = { url: String, description: String }

  declare inputTarget: HTMLInputElement
  declare outputTarget: HTMLElement
  declare urlValue: string
  declare descriptionValue: string

  connect() {
    // 型安全にアクセス可能
  }
}
```
**Bad:**
```typescript
export default class extends Controller {
  static targets = ['input', 'output']
  static values = { url: String }

  // declare なし - TypeScript型安全性が失われる
  connect() {
    this.inputTarget // any型になる
  }
}
```

### disconnect()でクリーンアップ必須
**Good:**
```typescript
export default class extends Controller {
  private chart: Chart | null = null

  connect() {
    this.chart = new Chart(this.element as HTMLCanvasElement, config)
  }

  disconnect() {
    this.chart?.destroy()
    this.chart = null
  }
}
```
