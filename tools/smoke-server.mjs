import { spawn } from 'node:child_process';

const port = Number(process.env.PORT ?? 4173);
const server = spawn(process.execPath, ['tools/serve.mjs'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, PORT: String(port) }
});

let output = '';
server.stdout.on('data', (chunk) => { output += chunk; });
server.stderr.on('data', (chunk) => { output += chunk; });

try {
  await waitForServer(port);
  await assertOk(`http://localhost:${port}/`, 'text/html');
  await assertOk(`http://localhost:${port}/app/app.js`, 'text/javascript');
  await assertOk(`http://localhost:${port}/dist/core/pipeline.js`, 'text/javascript');
  console.log('Smoke check passed: browser demo assets are reachable.');
} finally {
  server.kill('SIGTERM');
}

async function waitForServer(targetPort) {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://localhost:${targetPort}/`);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error(`Server did not start on port ${targetPort}. Output:\n${output}`);
}

async function assertOk(url, expectedContentType) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes(expectedContentType)) {
    throw new Error(`${url} returned unexpected content-type ${contentType}`);
  }
}
