# Vue Rules - Examples

## Principles Examples

### Composition API
**Good:**
```typescript
export default defineComponent({
  props: {
    timeCard: { type: Object as PropType<TimeCardItem>, required: true },
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const state = reactive({ editing: false })
    const label = computed(() => props.timeCard.dateText)
    return { t, state, label }
  },
})
```
**Bad:**
```typescript
// Options API (使用禁止)
export default {
  data() {
    return { editing: false }
  },
  computed: {
    label() { return this.timeCard.dateText }
  },
}
```

### ローカル状態管理
**Good:**
```typescript
setup(props) {
  const state = reactive({
    startAtText: props.timeCard.startAtText,
    endAtText: props.timeCard.endAtText,
  })
  const isEditing = computed(() => state.startAtText !== props.timeCard.startAtText)
  return { state, isEditing }
}
```

### スコープドスタイル
**Good:**
```vue
<style scoped lang="sass">
.time-card-row
  display: flex

  &.is-readonly
    opacity: 0.6

  :deep(.child-component)
    margin: 0
</style>
```

### カスタムイベントはkebab-case
**Good:**
```vue
<template>
  <button @click="$emit('on-click-fill', data)">Fill</button>
</template>
```
