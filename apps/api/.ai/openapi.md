# OpenAPI Documentation Instructions

## General Rules

- Generate or update OpenAPI documentation only for the requested module.
- Do not modify unrelated modules unless a shared OpenAPI helper is required.
- Follow the existing Fastify route schema style already used in the repository.
- Keep changes minimal, readable, and consistent with current naming.

## Documentation Goal

Document the module's HTTP API so it appears correctly in the generated OpenAPI spec and API docs.

Prefer documenting existing routes instead of inventing new endpoints.

## Route Schema Rules

For Fastify HTTP routes, prefer adding a `schema` object with:

- `tags`
- `operationId`
- `summary`
- `description`
- `security` when authentication is required
- `params` when route params exist
- `querystring` when query params exist
- `body` when request body exists
- `response` for success and important error cases

Use `toOpenApiSchema(...)` for Zod request schemas.

## Response Documentation

Document the relevant success and error responses for each route.

Common cases:

- `200` for successful reads and updates
- `201` for successful creates
- `204` for successful deletes
- `400` for validation errors
- `401` for protected routes
- `404` when resource lookup can fail
- `409` only when the module can return conflicts
- `429` when the route is rate-limited
- `500` for unexpected failures

Prefer shared response schemas from `src/shared/http/openapi.ts` instead of repeating inline objects.

## Shared OpenAPI Helpers

If the requested module needs reusable response schemas, examples, or helpers:

- add the smallest reasonable shared definitions to `src/shared/http/openapi.ts`
- keep them module-appropriate and reusable
- do not refactor unrelated OpenAPI definitions

Prefer following existing patterns such as:

- `toOpenApiSchema(...)`
- `createRateLimitOpenApiResponse(...)`
- shared `...ResponseSchema` exports
- module-specific examples and descriptions

## Tags And Security

- Reuse an existing tag when appropriate.
- If the module needs a new top-level OpenAPI tag, update the root tag list in `src/app.ts`.
- For authenticated endpoints, use `security: [{ cookieAuth: [] }]` when that matches the module behavior.

## Descriptions And Naming

- Keep summaries short and action-oriented.
- Keep descriptions concrete and user-facing.
- Use stable, descriptive `operationId` values.
- Match route naming and nested resource semantics already present in the module.

## What To Avoid

- do not invent endpoints or fields that are not implemented
- do not document behavior that the code does not have
- do not add dependencies
- do not rewrite unrelated route handlers
- do not create broad OpenAPI refactors outside the requested module

## Verification

- Run the narrowest relevant `pnpm` command if verification is needed by the change.
- Prefer small, targeted validation over broad test runs.
