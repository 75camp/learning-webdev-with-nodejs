const Server = require('./lib/interceptor-server');

const mime = require('mime');
const url = require('url');
const parseQuery = require('./lib/middleware/query');
const router = require('./lib/middleware/router');

function getMimeType(res) {
  const EXT_MIME_TYPES = mime.types;

  const path = require('path');
  const mime_type = EXT_MIME_TYPES[path.extname(res).slice(1) || 'html'];
  return mime_type;
}

const app = new Server();

app.use((context, next) => {
  console.log(`Visit: ${context.req.url}`);
  next();
});

app.use(async (context, next) => {
  const req = context.req;
  const srvUrl = url.parse(`http://${req.url}`);
  let path = srvUrl.path;
  if(path === '/') path = '/index.html';

  const resPath = `resource${path}`.replace(/\?.*/g, '');
  const mimeType = getMimeType(resPath);
  context.mimeType = mimeType;

  await next();
});

// app.use(parseQuery);

// app.use((context, next) => {
//   context.status = 200;
//   context.body = `<h1>Hello World!</h1>${JSON.stringify(context.query)}`;
// });

const index = router.get('/', (context, next) => {
  context.status = 200;
  context.body = 'Hello';
  next();
});

const test = router.get('/test', (context, next) => {
  context.status = 200;
  context.body = 'Test';
  next();
});

app.use(index);
app.use(test);

app.listen(10080, (server) => {
  console.log('opened server on', server.address());
});
