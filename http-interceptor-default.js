const Server = require('./lib/server');

const app = new Server();

app.use(async ({res}, next) => {
  res.setHeader('Content-Type', 'text/html');
  res.body = '<h1>Hello world</h1>';
  await next();
});

app.listen({
  port: 9090,
  host: '0.0.0.0',
});