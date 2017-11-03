const net = require('net');

let responseDataTpl = `HTTP/1.1 200 OK
Connection: keep-alive
Date: ${new Date()}
Content-Length: 12
Content-Type: text/plain

Hello world!
`;


let server = net.createServer((socket) => {
  
  socket.setKeepAlive(true, 60000);

  socket.write(responseDataTpl);
  socket.pipe(socket);

  socket.on('data', function(data){
    console.log('DATA ' + socket.remoteAddress + ': ' + data);
    //socket.end('goodbye\n');
  });

  socket.on('close', function(){
    console.log('connection closed, goodbye!\n\n\n');
  });
}).on('error', (err) => {
  // handle errors here
  throw err;
});

server.listen({
  host: '0.0.0.0',
  port: 10080,
  exclusive: true
}, ()=>{
  console.log('opened server on', server.address());
});
