const url = require('url');
const querystring = require('querystring');

module.exports = async function (ctx, next) {
  const {req} = ctx;
  const {query} = url.parse(`http://${req.headers.host}${req.url}`);
  ctx.params = querystring.parse(query);
  await next();
};
