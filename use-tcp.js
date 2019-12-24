const net = require('net');

const responseDataTpl = `HTTP/1.1 200 OK
Connection: keep-alive
Date: ${new Date()}
Content-Length: 21
Content-Type: text/html

<h1>Hello world!</h1>
`;


const server = net.createServer((socket) => {
  socket.setKeepAlive(true, 600000);

  socket.write(responseDataTpl);

  socket.on('data', (data) => {
    console.log(`DATA:\n\n${data}`);
  });

  socket.on('close', () => {
    console.log('connection closed, goodbye!\n\n\n');
  });
}).on('error', (err) => {
  // handle errors here
  throw err;
});

server.listen({
  host: '0.0.0.0',
  port: 10080,
  exclusive: true,
}, () => {
  console.log('opened server on', server.address());
});
