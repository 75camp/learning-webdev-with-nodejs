const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const zlib = require('zlib');

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
      let status = 200;
      if(timeStamp && Number(timeStamp) === stats.mtimeMs) {
        status = 304;
      }
      const mimeType = mime.getType(ext);
      const responseHeaders = {
        'Content-Type': mimeType,
        'Cache-Control': 'max-age=86400', // 缓存一天
        'Last-Modified': stats.mtimeMs,
      };
      const acceptEncoding = req.headers['accept-encoding'];
      const compress = acceptEncoding && /^(text|application)\//.test(mimeType);
      if(compress) {
        acceptEncoding.split(/\s*,\s*/).some((encoding) => {
          if(encoding === 'gzip') {
            responseHeaders['Content-Encoding'] = 'gzip';
            return true;
          }
          if(encoding === 'deflate') {
            responseHeaders['Content-Encoding'] = 'deflate';
            return true;
          }
          if(encoding === 'br') {
            responseHeaders['Content-Encoding'] = 'br';
            return true;
          }
          return false;
        });
      }
      const compressionEncoding = responseHeaders['Content-Encoding'];
      res.writeHead(status, responseHeaders);
      if(status === 200) {
        const fileStream = fs.createReadStream(filePath);
        if(compress && compressionEncoding) {
          let comp;
          if(compressionEncoding === 'gzip') {
            comp = zlib.createGzip();
          } else if(compressionEncoding === 'deflate') {
            comp = zlib.createDeflate();
          } else {
            comp = zlib.createBrotliCompress();
          }
          fileStream.pipe(comp).pipe(res);
        } else {
          fileStream.pipe(res);
        }
      } else {
        res.end();
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