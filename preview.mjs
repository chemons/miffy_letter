// Optional local preview; the deployed page does not need Node.js.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const name = decodeURIComponent(url.pathname);
    if (name === '/favicon.ico') { response.writeHead(204).end(); return; }
    const isOriginalImage = /^\/assets\/miffy\/[a-z]+(?:-[23])?\.png$/.test(name);
    const isUserImage = /^\/assets\/miffy_new\/[a-f0-9]{32}\.jpg$/.test(name);
    if (name !== '/' && name !== '/index.html' && !isOriginalImage && !isUserImage) {
      response.writeHead(404).end('Not found'); return;
    }
    const file = path.join(root, name === '/' ? 'index.html' : name.slice(1));
    const data = await readFile(file);
    const contentType = name.endsWith('.jpg') ? 'image/jpeg' : name.endsWith('.png') ? 'image/png' : 'text/html; charset=utf-8';
    response.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-store' });
    response.end(data);
  } catch { response.writeHead(404).end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
