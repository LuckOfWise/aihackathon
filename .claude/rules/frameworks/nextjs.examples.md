# Next.js Rules - Examples

## Principles Examples

### 薄いページ
**Good:**
```tsx
// src/app/(default)/page.tsx
import { Root } from '~/components/pages/Root';

export default function RootPage() {
  return <Root />;
}
```
**Bad:**
```tsx
// page.tsxにロジックを直接記述
export default function RootPage() {
  const [data, setData] = useState([]);
  useEffect(() => { fetchData().then(setData); }, []);
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>;
}
```

### Suspenseファーストローディング
**Good:**
```tsx
// src/app/layout.tsx
<Suspense fallback={<LoadingScreen />}>
  <Providers>{children}</Providers>
</Suspense>
```

### ルートグループ活用
```
src/app/
├── (default)/     # ナビバー付きレイアウト
│   ├── layout.tsx
│   └── page.tsx
├── (auth)/        # 認証ページレイアウト
│   ├── layout.tsx
│   └── sign-in/page.tsx
└── admin/         # 管理者ページ
    ├── layout.tsx
    └── users/page.tsx
```
