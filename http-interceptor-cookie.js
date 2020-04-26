const Server = require('./lib/server');
const Router = require('./lib/middleware/router');

const cookie = require('./lib/aspect/cookie'); 

const app = new Server();

const router = new Router();

app.use(cookie);

const users = {};
app.use(router.get('/foobar', async ({cookies, route, res}, next) => {
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  let id = cookies.interceptor_js;
  if(id) {
    users[id] = users[id] || 1;
    users[id]++;
    res.body = `<h1>你好，欢迎第${users[id]}次访问本站</h1>`;
  } else {
    id = Math.random().toString(36).slice(2);
    users[id] = 1;
    res.body = '<h1>你好，新用户</h1>';
  }
  res.setHeader('Set-Cookie', `interceptor_js=${id}; Path=/foobar1; Max-Age=${86400}`);
  await next();
}));

app.use(router.all('.*', async ({req, res}, next) => {
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 404;
  res.body = '<h1>Not Found</h1>';
  await next();
}));

app.listen({
  port: 9090,
  host: '0.0.0.0',
});