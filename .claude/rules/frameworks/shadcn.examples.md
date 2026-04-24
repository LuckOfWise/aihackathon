# Shadcn UI Rules - Examples

## Principles Examples

### Form + Zodパターン
**Good:**
```tsx
import { Controller } from 'react-hook-form';
import { z } from 'zod';
import { Field, FieldError } from '~/components/ui/field';

export const emailValidation = z.email({ error: 'メールアドレスの形式が正しくありません' });

export const EmailInput = <T extends FieldValues>({ control, required }: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FormFieldLabel htmlFor={name} required={required}>{label}</FormFieldLabel>
          <Input id={name} type='text' aria-label={label} {...field} />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
};
```
**Bad:**
```tsx
// インラインバリデーション、zodスキーマなし
const EmailInput = ({ value, onChange }) => {
  const [error, setError] = useState('');
  const validate = (v: string) => {
    if (!v.includes('@')) setError('Invalid email');
  };
  return (
    <div>
      <label>Email</label>
      <input value={value} onChange={e => { onChange(e); validate(e.target.value); }} />
      {error && <span>{error}</span>}
    </div>
  );
};
```

### コンポジション
**Good:**
```tsx
export const ConfirmButton = ({ title, message, onConfirm, ...props }: Props) => {
  const { confirm } = useConfirmDialog();
  const handleClick = useCallback(() => {
    confirm({ title, message, onConfirm });
  }, [confirm, title, message, onConfirm]);
  return <Button {...props} onClick={handleClick} />;
};
```
