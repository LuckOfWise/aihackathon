# Vitest Testing Rules - Examples

## Principles Examples

### Co-location
**Good:**
```
src/components/forms/auth/
├── SignUpForm.tsx
└── _tests/
    └── SignUpForm.test.tsx
```
**Bad:**
```
src/components/forms/auth/SignUpForm.tsx
tests/unit/components/forms/auth/SignUpForm.test.tsx  # 遠い場所にテスト配置
```

### Mock isolation
**Good:**
```typescript
afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});
```

### 日本語テスト名
**Good:**
```typescript
describe('未認証の場合', () => {
  it('読み込みできない(get)', async () => {
    await assertFails(getDoc(userRef(db, user.id)));
  });

  it('作成できない', async () => {
    const newUser = userFactory.build();
    await assertFails(addDoc(usersRef(db), newUser));
  });
});
```
**Bad:**
```typescript
describe('unauthenticated user', () => {
  it('should not be able to read', async () => { /* ... */ });
});
```

### ファクトリパターン
**Good:**
```typescript
import { userFactory } from '@local/test-shared';

const user = userFactory.build({ id: 'user-id', role: 'user' });
const admin = userFactory.build({ id: 'admin-id', role: 'admin' });
```
