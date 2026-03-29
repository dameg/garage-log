import { execSync, spawnSync } from 'node:child_process';

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('Usage: pnpm codex:review <module-name>');
  process.exit(1);
}

const diff = execSync(`git diff -- ${moduleName}`, {
  encoding: 'utf8',
});

if (!diff.trim()) {
  console.log(`[codex:review] no diff for module=${moduleName}`);
  process.exit(0);
}

const prompt = `
Follow AGENTS.md and .ai/review.md strictly.

Review the diff for the "${moduleName}" module only.

Focus on:
- correctness
- regressions
- missing validation
- missing edge cases
- missing tests

Return concise findings only.
`.trim();

console.log(`[codex:review] module=${moduleName}`);
console.log('[codex:review] starting Codex...');

const result = spawnSync(
  'codex',
  ['exec', '--cd', process.cwd(), '--sandbox', 'read-only', '--ask-for-approval', 'never', '-'],
  {
    input: `${prompt}\n\n--- DIFF START ---\n${diff}\n--- DIFF END ---\n`,
    stdio: ['pipe', 'inherit', 'inherit'],
    shell: process.platform === 'win32',
  },
);

console.log(`[codex:review] finished with status=${result.status ?? 1}`);
process.exit(result.status ?? 1);
