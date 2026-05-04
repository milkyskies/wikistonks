<!-- managed by milky-kit | DO NOT EDIT — changes will be overwritten on next sync -->

# Frontend Directory Structure

```
src/
├── app/                   Framework shell
│   └── routes/            TanStack Router file-based routes
├── features/              UI by domain
│   ├── shared/            Reusable across features
│   │   ├── components/    Shared components
│   │   ├── ui/            Thin re-exports of UI library
│   │   ├── icons/         Re-exports of icon library
│   │   └── providers/     App-wide providers
│   └── {feature-name}/    Feature-scoped components
│       └── components/
├── services/              API communication
│   └── api/
│       ├── _generated/    Auto-generated (don't edit)
│       └── {resource}/    Service layers per resource
├── lib/                   Generic utilities
│   └── tanstack-query/    TanStack Query helpers
├── models/                Shared domain types
├── config/                Environment variables + app config
└── assets/                Static assets
```

## Dependency rules

- `app/routes` -> `features`
- `features` -> `services`, `lib`, `models`
- `features/shared` -> nothing from other features
- `services` -> `lib`, `models`
- `lib` -> nothing (third-party only)
- `models` -> nothing (or `_generated` types)
