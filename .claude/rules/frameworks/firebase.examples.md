# Firebase Rules - Examples

## Principles Examples

### ラッパーファースト
**Good:**
```typescript
import { addDoc, serverTimestamp } from '~/utils/firebase/firestore';
import { getAuth } from '@local/admin-shared';
```
**Bad:**
```typescript
import { addDoc } from 'firebase/firestore';         // ESLintエラー
import { getAuth } from 'firebase-admin/auth';        // ESLintエラー
```

### 型安全コンバーター
**Good:**
```typescript
const getConverter = <T extends DocumentData>(): FirestoreDataConverter<WithId<T>, T> => ({
  toFirestore: (data) => {
    const { id, ...rest } = data;
    return rest as WithFieldValue<T>;
  },
  fromFirestore: (snapshot, options): WithId<T> => {
    return { id: snapshot.id, ...snapshot.data(options) } as WithId<T>;
  },
});
```

### モデル層分離
**Good:**
```typescript
// src/models/user.ts - 1ファイルにconverter + refs + queries + CRUD + hooksを集約
export const userConverter = getConverter<UserDocumentData>();
export const usersRef = () => collection(getFirestore(), 'users').withConverter(userConverter);
export const userRef = <Id extends string | null | undefined>(id: Id) =>
  (id ? doc(usersRef(), id) : null) as RefOrNull<Id>;
export const addUser = async (ref, data) => addDoc(ref, { ...userDefaultData, createdAt: serverTimestamp(), ...data });
export const useUserDocument = useDocumentData<User>;
```

### サーバータイムスタンプ
**Good:**
```typescript
export const addUser = async (ref: CollectionReference<User>, data: Partial<UserDocumentData>) =>
  addDoc(ref, {
    ...userDefaultData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...data,
  } as User);
```
**Bad:**
```typescript
addDoc(ref, { ...data, createdAt: new Date(), updatedAt: new Date() });
```
