const http = require('http');
const url = require('url');
const fs = require("fs");

function getMimeType(res){
  const EXT_MIME_TYPES = {
    'default': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'text/json',
    
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpg',
    '.png': 'image/png',
    
    //...
  }

  let path = require('path');
  let mime_type = EXT_MIME_TYPES[path.extname(res)] || EXT_MIME_TYPES['default'];
  return mime_type;
}

const server = http.createServer((req, res) => {
  let srvUrl = url.parse(`http://${req.url}`);
  let path = srvUrl.path;
  if(path === '/') path = '/index.html';
  
  let resPath = 'resource' + path; 

  let lastModified = req.headers['if-modified-since'];

  if(lastModified && Date.now() - new Date(lastModified) < 86400000){
    res.writeHead(304, {
        'Content-Type': getMimeType(resPath),
        'Last-Modified': new Date(lastModified),
        //'Expires': new Date(new Date(lastModified) + 86400000)
    });
    res.end();
  }else{
    
    if(!fs.existsSync(resPath)){
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end('<h1>404 Not Found</h1>');
    }

    let resStream = fs.createReadStream(resPath);
    res.writeHead(200, {
        'Content-Type': getMimeType(resPath),
        'Last-Modified': new Date(),
        //'Expires': new Date(Date.now() + 86400000)
    });

    resStream.pipe(res);
  }
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(10080, () => {
  console.log('opened server on', server.address());
});
