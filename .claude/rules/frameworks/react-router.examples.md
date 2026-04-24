# React Router Rules - Examples

## Principles Examples

### Thin route files
**Good:**
```tsx
// app/routes/_default._index.tsx
import { Root } from '~/components/pages/Root';

export default function RootPage() {
  return <Root />;
}
```
**Bad:**
```tsx
// ルートファイルにビジネスロジックを直接記述
export default function RootPage() {
  const { currentUser } = useAuth();
  const data = useDocumentData(userRef(currentUser?.id));
  return (
    <Stack>
      <Title>Welcome {data?.name}</Title>
      {/* ... 大量のUIロジック */}
    </Stack>
  );
}
```

### File-based routing
**Good:**
```
app/routes/
├── _auth.tsx                      # Auth layout (no URL segment)
├── _auth.sign-in._index.tsx       # /sign-in
├── _default.tsx                   # Default layout (authenticated)
├── _default._index.tsx            # / (home)
├── admin.tsx                      # /admin layout
└── admin._index.tsx               # /admin
```

### Layout grouping with underscore prefix
**Good:**
```typescript
export const DefaultLayout = withAuth(({ children }: { children: ReactNode }) => {
  const { signedIn } = useAuth();
  useEffect(() => {
    if (signedIn === false) replace('/sign-in');
  }, [signedIn]);
  if (signedIn !== true) return <LoadingScreen />;
  return <ResponsiveLayout>{children}</ResponsiveLayout>;
});
```
