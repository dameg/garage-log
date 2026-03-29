# Review Instructions

## Review Goal

Review code for correctness, regressions, missing validation, missing tests, and risky changes.

Focus on real engineering issues, not cosmetic opinions.

## Main Review Priorities

### 1. Correctness

Look for:

- wrong conditions
- broken branching logic
- invalid assumptions
- incorrect query construction
- mismatched route params
- missing ownership checks
- missing null/undefined handling

### 2. Validation

Check that:

- request parsing is done in the HTTP layer
- domain invariants remain enforced in domain logic
- Zod is not incorrectly moved into domain
- invalid input cannot silently pass through

### 3. Architecture

Check that:

- domain logic stays in `domain/`
- use cases stay in `application/`
- HTTP-specific logic stays in `presentation/`
- reusable cross-module code goes to `shared/`
- modules do not create unnecessary coupling

### 4. Testing

Check that:

- the appropriate test level was used
- important paths are covered
- edge cases are tested
- regressions are protected by tests
- tests are not duplicated unnecessarily

### 5. Risky Refactors

Flag:

- renames that affect many files without clear need
- hidden behavior changes
- widened scope beyond the requested module
- changes that break naming consistency
- route/schema mismatches

## Domain-Specific Review Rules

Pay extra attention to:

- date relationships
- normalization of optional fields
- nullable vs optional semantics
- non-negative numeric fields
- explicit IDs such as `vehicleId` and `documentLogId`
- nested resource route consistency

## Ignore or Deprioritize

Do not focus on:

- minor formatting/style issues
- subjective wording changes
- small stylistic preferences that do not affect readability
- refactors without product or correctness impact

## Output Format

Return concise findings only.

For each finding:

- explain the problem briefly
- explain the risk
- mention the affected file or area when possible

Prefer high-signal findings over long commentary.

## Severity Mindset

Prioritize:

- broken behavior
- missing validation
- missing tests for risky logic
- architecture violations
- hidden regressions

Deprioritize:

- low-value style remarks
- purely subjective preferences
