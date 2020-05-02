const Server = require('./lib/server');
const Router = require('./lib/middleware/router');

const app = new Server({instances: 0, mode: 'development'});
const router = new Router();

let count = 0;
process.on('message', (msg) => {
  console.log('visit count: %d', ++count);
});

// 统计访问次数
app.use(async (ctx, next) => {
  process.send('count');
  await next();
});

app.use(async (ctx, next) => {
  console.log(`visit ${ctx.req.url} through worker: ${app.worker.process.pid}`);
  await next();
});

app.use(router.all('.*', async ({req, res}, next) => {
  res.setHeader('Content-Type', 'text/html');
  res.body = '<h1>Hello world</h1>';
  await next();
}));

app.listen({
  port: 9090,
  host: '0.0.0.0',
});