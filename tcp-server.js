const net = require('net');

function responseData(str, status = 200, desc = 'OK') {
  return `HTTP/1.1 ${status} ${desc}
Connection: keep-alive
Date: ${new Date()}
Content-Length: ${str.length}
Content-Type: text/html

${str}`;
}


const server = net.createServer((socket) => {
  // socket.setKeepAlive(true, 600000);

  

  socket.on('data', (data) => {
    const matched = data.toString('utf-8').match(/^GET ([/\w]+) HTTP/);
    if(matched) {
      const path = matched[1];
      if(path === '/') {
        socket.write(responseData('<h1>Hello world</h1>'));
      } else {
        socket.write(responseData('<h1>Not Found</h1>', 404, 'NOT FOUND'));
      }
    }
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
  // exclusive: true,
}, () => {
  console.log('opened server on', server.address());
});
