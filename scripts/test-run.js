const http = require('http');

process.env.PORT = 3000;
require('../backend/app.js');

function get(path) {
  return new Promise((resolve) => {
    http.get({ hostname: 'localhost', port: 3000, path, agent: false }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', (err) => resolve({ error: String(err) }));
  });
}

(async () => {
  // Wait briefly for server to start
  await new Promise(r => setTimeout(r, 300));
  console.log('GET /test');
  console.log(await get('/test'));
  console.log('GET /gdansk/test');
  console.log(await get('/gdansk/test'));
  console.log('GET /');
  console.log(await get('/'));
  console.log('GET /gdansk/');
  console.log(await get('/gdansk/'));
  process.exit(0);
})();
