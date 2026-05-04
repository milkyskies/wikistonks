<!-- managed by milky-kit | DO NOT EDIT — changes will be overwritten on next sync -->

# Agent Instructions (OpenCode compatibility)

Claude Code reads `CLAUDE.md` and `.claude/rules/*.md` natively. This file exists so OpenCode (and other agent tools) can find them too.

## External file loading

When you see a file reference like `@.claude/rules/general.md`, use your Read tool to load it. Lazy — load based on what the current task actually needs, not preemptively. Loaded content is mandatory instruction.

Always-loaded rules are declared in `opencode.json` (`instructions` field). The rules below are topical — load them when relevant.

## Rules library

- @.claude/rules/blank-lines.md
- @.claude/rules/claude-meta.md
- @.claude/rules/config-and-env.md
- @.claude/rules/frontend-implementation.md
- @.claude/rules/frontend-structure.md
- @.claude/rules/hono-patterns.md
- @.claude/rules/models.md
- @.claude/rules/pnpm.md
- @.claude/rules/project-setup.md
- @.claude/rules/security.md
- @.claude/rules/testing.md
- @.claude/rules/ts-style.md
- @.claude/rules/worktrees.md
