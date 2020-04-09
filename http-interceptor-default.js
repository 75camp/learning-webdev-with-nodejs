const Server = require('./lib/server');
const Router = require('./lib/middleware/router');

const app = new Server();

const router = new Router();

app.use(router.all('/test/:course/:lecture', async ({route, res}, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.body = route;
  await next();
}));

app.use(router.all('.*', async ({req, res}, next) => {
  res.setHeader('Content-Type', 'text/html');
  res.body = '<h1>Hello world</h1>';
  await next();
}));

// app.use(async ({req, res}, next) => {
//   res.setHeader('Content-Type', 'text/html');
//   res.body = '<h1>Hello world</h1>';
//   await next();
// });

app.listen({
  port: 9090,
  host: '0.0.0.0',
});