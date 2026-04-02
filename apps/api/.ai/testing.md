# Testing Instructions

## General Rules

- Generate or update tests only for the requested module.
- Do not modify tests in unrelated modules.
- Prefer extending existing test files instead of creating duplicate suites.
- Follow the existing testing style and naming conventions in the repository.
- Reuse existing builders, test doubles, actions, auth helpers, and shared app harnesses before adding new helpers.
- Keep feature-specific builders, doubles, and HTTP actions inside the owning module's `test/` directory.
- Keep tests focused, readable, and behavior-oriented.
- Prefer the smallest test setup that still makes the behavior clear.
- When a module starts accumulating repeated test setup, create or update module-local test helpers instead of repeating inline setup across files.

## Module Test Helpers

When generating tests for a module, prefer creating or updating helpers inside:

- `src/modules/<module>/test/`

Typical helper structure:

- `src/modules/<module>/test/<module>.domain.builder.ts`
- `src/modules/<module>/test/<module>.http.builder.ts`
- `src/modules/<module>/test/actions/<module>.actions.ts`
- `src/modules/<module>/test/in-memory/in-memory-<module>.repository.ts`
- `src/modules/<module>/test/in-memory/spy-<module>.repository.ts`

Create these helpers when they improve clarity or remove repetition:

### Domain Builder

Use for:

- repeated domain object setup
- readable default test data
- changing only 1-2 fields in a test

Rules:

- prefer builders for domain tests and use case tests when the same entity setup appears repeatedly
- give sensible defaults that produce a valid object
- expose small `withX(...)` methods for the fields commonly changed in tests
- keep the builder owned by the module, not in global shared test folders

### HTTP Builder

Use for:

- repeated HTTP payload setup for integration or e2e tests
- request bodies with many optional fields

Rules:

- create an HTTP builder when request payload setup is repeated across route-level tests
- keep defaults valid and minimal
- use it for request payloads only, not for response assertions

### Module Actions

Use for:

- repeated `app.inject(...)` calls for one module
- hiding route paths and HTTP methods behind readable helpers

Rules:

- create module-local `actions/<module>.actions.ts` for route-level integration and e2e tests
- keep actions thin: they should wrap `app.inject(...)`, route path, method, headers, query, and payload
- do not move module-specific actions into shared testing utilities
- prefer updating an existing actions file over creating duplicate wrappers

### In-Memory Repository

Use for:

- stateful use case tests
- tests that read better when they create data, mutate it, and then inspect the result

Rules:

- create an in-memory repository when the use case behavior is easier to understand through realistic state changes
- store data in memory and implement only the repository behavior needed by the module tests
- keep filtering/sorting helpers next to the module if they are module-specific

### Spy Repository

Use for:

- verifying repository calls
- checking query mapping and orchestration behavior

Rules:

- create a spy repository when the test needs to assert what query or command was sent to the repository
- record the important input, for example `lastQuery`, `lastCreateInput`, or `calls`
- keep return values simple and deterministic
- prefer a spy over in-memory when the main assertion is about collaborator interaction, not stateful behavior

## Test Types

This project uses multiple levels of testing:

### Domain Unit Tests

Use for:

- pure domain functions
- factories
- invariant validation
- normalization logic

Rules:

- do not mock domain logic
- do not involve HTTP or database
- focus on invariants and edge cases

Examples:

- invalid date ranges
- optional field normalization
- non-negative cost validation

### Use Case Unit Tests

Use for:

- application/use case flows
- orchestration logic

Rules:

- use the simplest test double that keeps the test focused
- prefer existing spy or in-memory repositories over ad-hoc mocks when they already fit the use case
- mock external services
- verify behavior, not implementation details
- cover happy path and key failure scenarios
- create or extend module-local builders and repository doubles when repeated setup starts obscuring the test intent

Examples:

- entity created successfully
- related resource not found
- ownership/access checks
- repository conflict/error propagation

### Integration Tests

Use for:

- HTTP handlers
- route + schema + use case integration
- in-memory wiring between layers

Rules:

- prefer integration tests for route-level changes
- prefer `src/shared/testing/create-test-app.ts` for in-memory app setup
- include request validation when relevant
- verify status codes and response shape
- cover auth and ownership behavior when relevant
- prefer module-local HTTP builders and module actions for repeated request setup

### E2E Tests

Use for:

- full request/response flows
- auth-protected endpoints
- realistic application behavior with real infrastructure

Rules:

- use sparingly
- only when full flow validation matters
- reserve for scenarios that depend on real database, real auth wiring, or infrastructure behavior
- do not duplicate the entire integration CRUD matrix unless infrastructure is part of the risk

## How to Choose the Test Level

- If modifying `domain/` → generate domain unit tests
- If modifying `application/` / use cases → generate use case unit tests
- If modifying `presentation/` / routes / request schemas → prefer integration tests
- Only generate e2e tests when the full HTTP flow with real infrastructure matters

## Mocking Rules

- Prefer existing module-local test helpers first when they are specific to one feature
- Use `src/test/doubles/` only for truly shared cross-module doubles
- Use spy repositories when the test verifies mapping or orchestration toward a collaborator
- Use in-memory repositories when the behavior is clearer with stateful setup
- Mock external services
- Do NOT mock domain logic
- Do NOT over-mock simple value objects or pure functions
- Avoid `as any` in tests unless there is no practical alternative
- If a useful test double does not exist yet for the module, create it in the module's `test/` directory instead of inlining complex mocks in the test file

## What Good Tests Should Cover

- happy path
- edge cases
- invalid inputs
- business invariant violations
- authorization/ownership checks where applicable
- important regressions introduced by the change

## What to Avoid

- do not test implementation details
- do not generate snapshot-heavy tests unless already used
- do not create redundant tests that repeat the same behavior
- do not add broad, low-signal tests just to increase coverage
- do not duplicate nearly identical integration and db e2e scenarios without a clear infrastructure reason
- do not leave repeated payload setup, route calls, or domain object construction duplicated across many tests when a small helper would make the suite clearer
- do not put one-module-only builders, actions, or repositories into broad shared test folders

## Test Naming

Use clear names such as:

- `vehicle.test.ts` for aggregate/domain behavior in one module
- `create-document-log.test.ts`
- `update-document-log.test.ts`
- `build-document-log.test.ts`

Test descriptions should describe behavior, for example:

- `should create a document log with normalized optional fields`
- `should throw when validTo is before validFrom`
- `should return 404 when vehicle does not exist`
- `should map list input into repository query`

## Command Scope

- Prefer running the smallest relevant test scope
- Do not run the full test suite unless necessary
