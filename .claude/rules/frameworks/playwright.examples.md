# Playwright E2E Testing Rules - Examples

## Principles Examples

### セマンティックセレクタ
**Good:**
```typescript
get emailInput(): Locator {
  return this.signInForm.getByLabel('メールアドレス', { exact: true });
}

get submitButton(): Locator {
  return this.signInForm.getByRole('button', { name: 'サインイン' });
}
```
**Bad:**
```typescript
get emailInput(): Locator {
  return this.page.locator('#email-input');
}

get submitButton(): Locator {
  return this.page.locator('.btn-submit');
}
```

### Page Object Model
**Good:**
```typescript
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract get path(): string;

  get url(): string {
    return BasePage.urlFor(this.path);
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  get confirmDialog(): Locator {
    return this.page.getByRole('alertdialog');
  }
}

export class SignInPage extends BasePage {
  get path(): string {
    return '/sign-in';
  }

  get signInForm(): Locator {
    return this.page.getByRole('form', { name: 'サインインフォーム' });
  }
}
```

### 適切な待機
**Good:**
```typescript
// 暗黙的待機 - toBeVisible()はPollingで待機
await expect(inquiryContactPage.title).toBeVisible();
```
**Bad:**
```typescript
// 明示的なsleep
await page.waitForTimeout(3000);
```
