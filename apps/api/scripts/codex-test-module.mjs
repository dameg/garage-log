import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('Usage: pnpm codex:test <module-name>');
  process.exit(1);
}

function resolveModuleDir(input) {
  const normalized = input.replace(/\/$/, '');
  const directPath = path.resolve(process.cwd(), normalized);

  if (existsSync(directPath)) {
    return directPath;
  }

  const modulePath = path.resolve(process.cwd(), 'src/modules', normalized);

  if (existsSync(modulePath)) {
    return modulePath;
  }

  return null;
}

function readUseCaseAudit(moduleDir) {
  const applicationDir = path.join(moduleDir, 'application');

  if (!existsSync(applicationDir)) {
    return null;
  }

  const entries = readdirSync(applicationDir)
    .filter((entry) => entry.endsWith('.usecase.ts') && !entry.endsWith('.usecase.test.ts'))
    .sort();

  if (entries.length === 0) {
    return {
      lines: ['- no application/*.usecase.ts files found'],
      missingTests: [],
    };
  }

  const missingTests = [];
  const lines = entries.map((entry) => {
    const expectedTest = entry.replace('.usecase.ts', '.usecase.test.ts');
    const hasTest = existsSync(path.join(applicationDir, expectedTest));

    if (!hasTest) {
      missingTests.push(expectedTest);
    }

    return `- ${entry} -> ${expectedTest} [${hasTest ? 'present' : 'missing'}]`;
  });

  return { lines, missingTests };
}

const moduleDir = resolveModuleDir(moduleName);
const useCaseAudit = moduleDir ? readUseCaseAudit(moduleDir) : null;

const prompt = `
Follow AGENTS.md and .ai/testing.md strictly.

Generate or update tests only for the "${moduleName}" module.

Requirements:
- Keep changes scoped to this module only
- Follow existing repository patterns
- Choose the appropriate test level for the changed code
- Audit every application use case in scope before finishing
- Do not stop while a primary use case lacks test coverage unless you have a concrete reason
- Run the narrowest relevant test command with pnpm
- Do not add dependencies

Module path:
- ${moduleDir ?? 'module directory could not be resolved automatically'}

Use case audit:
${useCaseAudit ? useCaseAudit.lines.join('\n') : '- application folder could not be inspected automatically'}
${useCaseAudit && useCaseAudit.missingTests.length > 0 ? `\nMissing use case tests detected:\n${useCaseAudit.missingTests.map((testFile) => `- ${testFile}`).join('\n')}` : ''}
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
