# Mantine UI Rules - Examples

## Principles Examples

### コンポーネントスタイリング
**Good:**
```tsx
// 1. Mantineプロパティ優先
<Stack justify='space-between' h='100%' gap={4}>

// 2. Tailwindクラス（tw:プレフィックス）
<Text size='sm' fw={600} className='tw:whitespace-pre-wrap'>

// 3. CSS Modules（複雑なスタイル）
import classes from './_styles/Chat.module.css';
<Card classNames={{ root: classes.root }}>
```
**Bad:**
```tsx
// stylesプロパティは使わない
<Card styles={{ root: { overflow: 'auto' } }}>
```

### Form + Zod パターン
**Good:**
```typescript
const schema = z.object({
  email: emailValidation,
  password: passwordValidation,
});

const form = useForm<FormValues>({
  validate: zod4Resolver(schema),
  initialValues: { email: '', password: '' },
});
```
**Bad:**
```typescript
const form = useForm({
  validate: {
    email: (value) => (!value.includes('@') ? 'Invalid email' : null),
  },
});
```

### Polymorphic button components
**Good:**
```typescript
<ConfirmButton
  title="削除確認"
  message="本当に削除しますか？"
  onConfirm={handleDelete}
  color="red"
>
  削除
</ConfirmButton>
```
