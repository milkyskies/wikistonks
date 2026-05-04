# Project Setup

This project was scaffolded with milky-kit.

## Stack
- Language: ts

## Starter resource

A `posts` CRUD resource is included as a working example across all layers.
When adding a new resource, follow the posts pattern in each layer.

## Development

All commands go through mise:
- `mise run dev` — start full stack
- `mise run check` — run all quality gates
- `mise run fmt` — format everything
- `mise run db:migrate` — run migrations
- `mise run api:generate` — regenerate OpenAPI client
- `mise run worktree:setup <num> <branch>` — create isolated worktree
