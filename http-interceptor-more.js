const Server = require('./lib/interceptor-server');
const router = require('./lib/middleware/router');
const parseQuery = require('./lib/middleware/query');

const app = new Server();

app.use((context, next) => {
  console.log(`Visit: ${context.req.url}`);
  next();
});

app.use(parseQuery);

const index = router.get('/', (context, next) => {
  context.status = 200;
  const query = context.query;
  context.body = `<h1>Hello World!</h1><div>${JSON.stringify(query)}</div>`;
  next();
});

const list = router.get('/list', (context, next) => {
  context.status = 200;
  context.body = JSON.stringify({
    error: '',
    data: [
      {name: 'akira', age: '35'},
      {name: 'bob', age: '25'},
      {name: 'jane', age: '37'},
      {name: 'ann', age: '35'},
    ],
  });
  context.mimeType = 'application/json';
  next();
});

const user = router.get('/user', (context, next) => {
  context.status = 200;
  context.body = JSON.stringify({
    name: 'akira',
  });
  context.mimeType = 'application/json';
  next();
});

app.use(index);
app.use(list);
app.use(user);

app.listen(10080, (server) => {
  console.log('opened server on', server.address());
});
