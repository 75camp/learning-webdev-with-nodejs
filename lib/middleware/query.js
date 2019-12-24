const qs = require('qs');
const url = require('url');

module.exports = async function (context, next) {
  const queryStr = context.req.url;
  if(queryStr) {
    context.query = qs.parse(url.parse(`http://${queryStr}`).search.slice(1));
  }
  await next();
};