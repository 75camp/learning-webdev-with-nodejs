const Server = require('./lib/interceptor-server');

const app = new Server();

app.use((context, next) => {
  console.log(`Visit: ${context.req.url}`);
  next();
});

app.use((context, next) => {
  context.status = 200;
  context.body = '<h1>Hello World!</h1>';
});

app.listen(10080, (server) => {
  console.log('opened server on', server.address());
});
