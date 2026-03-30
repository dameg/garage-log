import { spawnSync } from 'node:child_process';

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('Usage: pnpm codex:openapi <module-name>');
  process.exit(1);
}

const prompt = `
Follow AGENTS.md and .ai/openapi.md strictly.

Generate or update OpenAPI documentation only for the "${moduleName}" module.

Requirements:
- Keep changes scoped to this module only
- Follow existing repository patterns
- Prefer documenting existing Fastify routes via route schema objects
- Reuse shared OpenAPI helpers, examples, and response schemas when appropriate
- Add the smallest necessary shared OpenAPI definitions if this module needs them
- Do not add dependencies
`.trim();

console.log(`[codex:openapi] module=${moduleName}`);
console.log('[codex:openapi] starting Codex...');

const result = spawnSync(
  'codex',
  ['exec', '--cd', process.cwd(), '--sandbox', 'workspace-write', prompt],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  },
);

console.log(`[codex:openapi] finished with status=${result.status ?? 1}`);
process.exit(result.status ?? 1);
