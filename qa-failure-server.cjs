// QA-only proxy: exercise real poster fallback without modifying source assets.
const http = require('node:http');
http.createServer((request, response) => {
  if (request.url.endsWith('.mp4')) { response.writeHead(503).end('Intentional QA media failure'); return; }
  const upstream = http.request({ hostname: '127.0.0.1', port: 4173, path: request.url, method: request.method, headers: request.headers }, result => {
    response.writeHead(result.statusCode, result.headers);
    result.pipe(response);
  });
  upstream.on('error', () => response.writeHead(502).end('Start node serve.cjs first'));
  request.pipe(upstream);
}).listen(4174, '127.0.0.1', () => console.log('Media failure QA: http://localhost:4174'));
