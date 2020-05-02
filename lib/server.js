const http = require('http');
const cluster = require('cluster');
const cpuNums = require('os').cpus().length;
const Interceptor = require('./interceptor.js');

module.exports = class {
  constructor({instances = 1, enableCluster = true, mode = 'production'} = {}) {
    if(mode === 'development') {
      instances = 1;
      enableCluster = true;
    }
    this.mode = mode;
    this.instances = instances || cpuNums;
    this.enableCluster = enableCluster;
    const interceptor = new Interceptor();

    this.server = http.createServer(async (req, res) => {
      await interceptor.run({req, res});
      if(!res.writableFinished) {
        let body = res.body || '200 OK';
        if(body.pipe) {
          body.pipe(res);
        } else {
          if(typeof body !== 'string' && res.getHeader('Content-Type') === 'application/json') {
            body = JSON.stringify(body);
          }
          res.end(body);
        }
      }
    });

    this.server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });

    this.interceptor = interceptor;
  }

  listen(opts, cb = () => {}) {
    if(typeof opts === 'number') opts = {port: opts};
    opts.host = opts.host || '0.0.0.0';
    const instances = this.instances;
    if(this.enableCluster && cluster.isMaster) {
      for(let i = 0; i < instances; i++) {
        cluster.fork();
      }

      function broadcast(message) { // eslint-disable-line no-inner-declarations
        Object.entries(cluster.workers).forEach(([id, worker]) => {
          worker.send(message);
        });
      }

      // 广播消息
      Object.keys(cluster.workers).forEach((id) => {
        cluster.workers[id].on('message', broadcast);
      });

      if(this.mode === 'development') {
        require('fs').watch('.', {recursive: true}, (eventType) => {
          if(eventType === 'change') {
            Object.entries(cluster.workers).forEach(([id, worker]) => {
              console.log('kill workder %d', id);
              worker.kill();
            });
            cluster.fork();
          }
        });
      } else {
        cluster.on('exit', (worker, code, signal) => {
          console.log('worker %d died (%s). restarting...',
            worker.process.pid, signal || code);
          cluster.fork();
        });
      }
    } else {
      this.worker = cluster.worker;
      console.log(`Starting up http-server
      http://${opts.host}:${opts.port}`);
      this.server.listen(opts, () => cb(this.server));
    }
  }

  use(aspect) {
    return this.interceptor.use(aspect);
  }
};