/* eslint-disable */
const http = require('http');
const url = require('url');
const fs = require("fs");
const path = require('path');

const server = http.createServer((req, res) => {
  let srvUrl = url.parse(`http://${req.url}`);
  console.log(req.url)
  let pathname = srvUrl.pathname;
  if(pathname === '/') pathname = '/index';
  let pathInfo = path.parse(pathname)

  if(!pathInfo.ext) {
    pathInfo.ext = '.html'
    pathInfo.base += pathInfo.ext
  }

  let resPath = path.join('resource', pathInfo.dir, pathInfo.base);

  if(!fs.existsSync(resPath)){
    res.writeHead(404, {'Content-Type': 'text/html'});
    return res.end('<h1>404 Not Found</h1>');
  }
  
  let resStream = fs.createReadStream(resPath);

  if(pathInfo.ext === '.html' || pathInfo.ext === '.htm'){
    res.writeHead(200, {'Content-Type': 'text/html'});
  } else if(pathInfo.ext === '.png') {
    res.writeHead(200, {'Content-Type': 'image/png'});
  }
  //...

  resStream.pipe(res);
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(10080, () => {
  console.log('opened server on', server.address());
});
