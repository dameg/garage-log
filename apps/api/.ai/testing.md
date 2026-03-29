# Testing Instructions

## General Rules

- Generate or update tests only for the requested module.
- Do not modify tests in unrelated modules.
- Prefer extending existing test files instead of creating duplicate suites.
- Follow the existing testing style and naming conventions in the repository.
- Keep tests focused, readable, and behavior-oriented.

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

- mock repositories
- mock external services
- verify behavior, not implementation details
- cover happy path and key failure scenarios

Examples:

- entity created successfully
- related resource not found
- ownership/access checks
- repository conflict/error propagation

### Integration Tests

Use for:

- HTTP handlers
- route + schema + use case integration
- database interaction between layers

Rules:

- prefer integration tests for route-level changes
- include request validation when relevant
- verify status codes and response shape

### E2E Tests

Use for:

- full request/response flows
- auth-protected endpoints
- realistic application behavior

Rules:

- use sparingly
- only when full flow validation matters

## How to Choose the Test Level

- If modifying `domain/` → generate domain unit tests
- If modifying `application/` / use cases → generate use case unit tests
- If modifying `presentation/` / routes / request schemas → prefer integration tests
- Only generate e2e tests when the full HTTP flow matters

## Mocking Rules

- Mock repositories in use case tests
- Mock external services
- Do NOT mock domain logic
- Do NOT over-mock simple value objects or pure functions

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

## Test Naming

Use clear names such as:

- `create-document-log.spec.ts`
- `update-document-log.spec.ts`
- `build-document-log.spec.ts`

Test descriptions should describe behavior, for example:

- `should create a document log with normalized optional fields`
- `should throw when validTo is before validFrom`
- `should return 404 when vehicle does not exist`

## Command Scope

- Prefer running the smallest relevant test scope
- Do not run the full test suite unless necessary
