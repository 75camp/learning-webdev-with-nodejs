/* eslint-disable */
const net = require('net');

let responseDataTpl = `HTTP/1.1 200 OK
Connection: keep-alive
Date: ${new Date()}
Content-Length: 21
Content-Type: text/html

<h1>Hello world!</h1>
`;


let server = net.createServer((socket) => {
  
  socket.setKeepAlive(true, 600000);

  socket.write(responseDataTpl);
  socket.pipe(socket);

  socket.on('data', function(data){
    console.log('DATA ' + socket.remoteAddress + ': \n' + data);
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
