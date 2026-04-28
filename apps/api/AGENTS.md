# AGENTS.md — Garage Log API

## General Rules

- Prefer `pnpm` for all commands.
- Keep changes minimal and scoped to the requested module.
- Do not modify unrelated modules.
- Do not introduce new dependencies unless explicitly required.
- Follow existing patterns and conventions in the repository.

## Architecture

This project follows a layered architecture:

- `domain/` → business logic, invariants, pure functions
- `application/` → use cases
- `presentation/` → HTTP layer
- `shared/` → cross-cutting concerns

### Important Rules

- Domain layer is the single source of truth for business invariants.
- Do NOT put Zod schemas in the domain layer.
- HTTP layer is responsible for parsing and basic validation only.
- Avoid cross-module coupling.
- Shared reusable logic should go to `shared/`.

## Validation

- Use Zod only in the HTTP layer.
- Use request parsing helpers:
  - `parseParams`
  - `parseBody`
  - `parseQuery`
