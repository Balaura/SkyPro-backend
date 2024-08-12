const http = require('http');
const { URL } = require('url');
const { getUsers } = require('./modules/users');

const PORT = process.env.PORT || 3003;

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const params = parsedUrl.searchParams;

  if (params.has('hello')) {
    const name = params.get('hello');
    if (name) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Hello, ${name}.`);
    } else {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Enter a name');
    }
  } else if (params.has('users')) {
    getUsers((err, users) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
      }
    });
  } else if (params.toString() === '') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
  } else {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});