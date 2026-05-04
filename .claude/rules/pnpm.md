<!-- managed by milky-kit | DO NOT EDIT — changes will be overwritten on next sync -->

# pnpm Workspace

- Use `pnpm` as the JavaScript package manager
- `pnpm add <package>` to add dependencies — never edit `package.json` by hand
- pnpm workspaces cover `apps/*` and `packages/*`
- **Worktrees don't share `node_modules`** — always run `pnpm install` after creating a worktree
