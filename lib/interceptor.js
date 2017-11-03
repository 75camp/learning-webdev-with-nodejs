module.exports =  class {
  constructor() {
    this.tasks = []
  }
  /**
    use(async (context, next) => {
      ...request...
      await next()
      ...response...
    })
   */
  use(/*async*/ functor) {
    this.tasks.push(functor)
  }
  async run(context) {
    const tasks = this.tasks

    const proc = tasks.reduceRight((a, b) => async () => {
      await b(context, a)
    }, () => Promise.resolve())
    
    try {
      await proc()
    } catch(ex) {
      console.error(ex.message)
    }

    return context
  }
}
