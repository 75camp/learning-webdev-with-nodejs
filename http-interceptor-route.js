const Server = require('./lib/interceptor-server');
const router = require('./lib/interceptor-router');

const app = new Server();

app.use((context, next) => {
  console.log(`Visit: ${context.req.url}`);
  next();
});

const index = router.get('/', (context, next) => {
  context.body = '<h1>Hello World!</h1>';
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

app.use(index);
app.use(list);

app.listen(10080, (server) => {
  console.log('opened server on', server.address());
});
