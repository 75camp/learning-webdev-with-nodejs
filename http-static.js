const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mime = require('mime');

const server = http.createServer((req, res) => {
  let filePath = path.resolve(__dirname, path.join('www', url.fileURLToPath(`file:///${req.url}`)));

  console.log(`Request: ${filePath}`);

  if(fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if(stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if(fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      const {ext} = path.parse(filePath);
      res.writeHead(200, {'Content-Type': mime.getType(ext)});
      return res.end(content);
    }
  }
  res.writeHead(404, {'Content-Type': 'text/html'});
  res.end('<h1>Not Found</h1>');
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(10080, () => {
  console.log('opened server on', server.address());
});
