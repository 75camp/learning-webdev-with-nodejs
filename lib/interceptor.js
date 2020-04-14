class Interceptor {
  constructor() {
    this.aspects = [];
  }
  /**
    use(async (context, next) => {
      ...request...
      await next()
      ...response...
    })
   */

  use(/* async */ functor) {
    this.aspects.push(functor);
    return this;
  }

  async run(context) {
    const aspects = this.aspects;

    const proc = aspects.reduceRight(function (a, b) { // eslint-disable-line
      return async () => {
        await b(context, a);
      };
    }, () => Promise.resolve());

    try {
      await proc();
    } catch (ex) {
      console.error(ex.message);
    }

    return context;
  }
}

module.exports = Interceptor;
