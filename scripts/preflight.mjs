import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const supergraphPath = join(root, 'supergraph', 'supergraph.graphql');
const supergraphValid = existsSync(supergraphPath) && statSync(supergraphPath).size > 0;
const needsCompose = !supergraphValid;
const localRouterPath = join(root, 'router', 'router');

function isInstalled(bin) {
  const cmd = process.platform === 'win32' ? 'where' : 'which';
  return spawnSync(cmd, [bin]).status === 0;
}

const failures = [];
const hasRouterBinary = existsSync(localRouterPath) || isInstalled('apollo-router');
if (!hasRouterBinary) {
  failures.push('apollo-router is not installed. Install it: https://www.apollographql.com/docs/router/quickstart');
}
if (needsCompose && !isInstalled('rover')) {
  failures.push(
    'supergraph/supergraph.graphql is missing and rover is not installed. ' +
    'Install it: https://www.apollographql.com/docs/rover/getting-started ' +
    '(or run "npm run compose:supergraph" manually)',
  );
}

if (failures.length > 0) {
  console.error('Preflight failed:');
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exit(1);
}

console.log(needsCompose
  ? 'Preflight OK: supergraph missing, will compose then start all services.'
  : 'Preflight OK: starting all services.');