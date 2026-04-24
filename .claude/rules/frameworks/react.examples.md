# React Rules - Examples

## Principles Examples

### 関数コンポーネント
**Good:**
```tsx
export const CustomFieldRows = memo(({ customFields }: { customFields: InquiryCustomField[] }) => (
  <>
    {customFields.map(({ id, label, value }) => (
      <Table.Tr key={id}>
        <Table.Th sticky>{label}</Table.Th>
        <Table.Td>{value}</Table.Td>
      </Table.Tr>
    ))}
  </>
));
CustomFieldRows.displayName = 'CustomFieldRows';
```

### Hooks優先
**Good:**
```tsx
const getActiveCustomFields = useCallback(
  (category: string) => customFields.filter(({ categoryIds }) => categoryIds.includes(category)),
  [customFields],
);
const schema = useMemo(() => createSchema(customFields, hasCategories), [customFields, hasCategories]);
```
**Bad:**
```tsx
// useMemoなしで毎回スキーマ再生成
const schema = createSchema(customFields, hasCategories);
```

### コロケーション
**Good:**
```
src/components/pages/Root/
├── Root.tsx
├── _components/
│   └── Dashboard.tsx
└── _tests/
    └── Root.test.tsx
```
