const http = require('http');
const json2html = require('node-json2html');

const server = http.createServer((req, res) => {
  const responseData = {
    name: 'akria',
    birthday: '1981-12-29',
  };

  const accept = req.headers.accept;

  if(accept.indexOf('application/json') >= 0) { // 不严格的判断
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(responseData));
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});

    const transform = {tag: 'h1', html: `${responseData.name} : ${responseData.birthday}`};
    res.end(json2html.transform(responseData, transform));
  }
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(10080, () => {
  console.log('opened server on', server.address());
});
