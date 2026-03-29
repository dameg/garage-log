import { spawnSync } from 'node:child_process';

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('Usage: pnpm codex:test <module-name>');
  process.exit(1);
}

const prompt = `
Follow AGENTS.md and .ai/testing.md strictly.

Generate or update tests only for the "${moduleName}" module.

Requirements:
- Keep changes scoped to this module only
- Follow existing repository patterns
- Choose the appropriate test level for the changed code
- Run the narrowest relevant test command with pnpm
- Do not add dependencies
`.trim();

console.log(`[codex:test] module=${moduleName}`);
console.log('[codex:test] starting Codex...');

const result = spawnSync(
  'codex',
  ['exec', '--cd', process.cwd(), '--sandbox', 'workspace-write', prompt],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  },
);

console.log(`[codex:test] finished with status=${result.status ?? 1}`);
process.exit(result.status ?? 1);
