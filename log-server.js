const http = require('http');
const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    console.log('--- RECEIVED LOG ---');
    console.log(body);
    console.log('--------------------');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.end('ok');
  });
});
server.listen(4000, () => console.log('Log server listening on 4000'));
