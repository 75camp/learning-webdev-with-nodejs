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
      const {ext} = path.parse(filePath);
      const stats = fs.statSync(filePath);
      const timeStamp = req.headers['if-modified-since'];
      if(timeStamp && Number(timeStamp) === stats.mtimeMs) {
        // 如果修改时间依然是last-modified时间，说明文件内容没有变化
        res.writeHead(304, {
          'Content-Type': mime.getType(ext),
          'Cache-Control': 'max-age=86400', // 缓存一天
          'Last-Modified': stats.mtimeMs,
        });
        res.end(); // 不发送body
      } else {
        res.writeHead(200, {
          'Content-Type': mime.getType(ext),
          'Cache-Control': 'max-age=86400', // 缓存一天
          'Last-Modified': stats.mtimeMs,
        });
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      }
    }
  } else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>Not Found</h1>');
  }
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(10080, () => {
  console.log('opened server on', server.address());
});