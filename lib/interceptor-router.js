const url = require('url')

function getPathName(context) {
  let srvUrl = url.parse(`http://${context.req.url}`)
  return srvUrl.pathname
}

module.exports = {
  get(route, functor) {
    return async function(context, next) {
      if(context.req.method === 'GET' && getPathName(context) === route){
        await functor(context, next)
      } else {
        await next()
      }
    }
  },
  post(route, functor) {
    return async function(context, next) {
      if(context.req.method === 'POST' && getPathName(context) === path){
        await functor(context, next)
      } else {
        await next()
      }
    }    
  }
}