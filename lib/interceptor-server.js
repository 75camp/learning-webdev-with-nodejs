const http = require('http')
const Interceptor = require('./interceptor.js')

module.exports =  class {
  constructor() {
    const interceptor = new Interceptor()

    this.server = http.createServer(async (req, res) => {
      const context = {req, res, body: '<h1>Not Found</h1>', status: 404, mimeType: 'text/html'}
     
      await interceptor.run(context)

      res.writeHead(context.status, {'Content-Type': context.mimeType})
      res.end(context.body)
    })

    this.server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
    })

    this.interceptor = interceptor
  }

  listen(port = 80, cb) {
    this.server.listen(port, () => cb(this.server))
  }

  use(functor) {
    this.interceptor.use(functor)
  }
}
