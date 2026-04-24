---
paths:
  - "app/graphql/**"
---
# Rails-GraphQL Rules

## Principles

- Relay Classic Mutation (GraphQL::Schema::RelayClassicMutationを継承)
- Dataloader活用 (N+1対策はGraphQL::Dataloader + カスタムSourceクラス)
- ActionCable Subscriptions (GraphQL::Subscriptions::ActionCableSubscriptions)
- introspection制限 (development以外で無効)
