
const tap = require('tap')
const { setHandler } = require('..')

tap.test('Readme code works', t => {
  const handler = {
    get: (target, prop, receiver) => {
      if (prop === 'foo') {
        return 'bar'
      }
      return Reflect.get(target, prop, receiver)
    }
  }
  const newHandler = setHandler(handler)

  const setProxy = new Proxy(new Set([42]), newHandler)

  t.equal(setProxy.foo, 'bar', 'initial handler is used')
  const a = []
  setProxy.forEach(e => a.push(e))
  t.same(a, [42], 'Set methods work') 
  t.end()
})

tap.test('the input handler does not have a get field', t => {
  const newHandler = setHandler({})

  const setProxy = new Proxy(new Set([42]), newHandler)

  const a = []
  setProxy.forEach(e => a.push(e))
  t.same(a, [42], 'Set methods work') 
  t.end()
})

tap.test('this is bound to proxy in class methods', t => {
  const handler = {
    get: (target, prop, receiver) => {
      if (prop === '__foo') {
        return 'bar'
      }
      return Reflect.get(target, prop, receiver)
    }
  }
  const newHandler = setHandler(handler)

  class MySet extends Set {
    getFoo() {
      return this.__foo
    }
  }

  const setProxy = new Proxy(new MySet([42]), newHandler)

  const a = []
  setProxy.forEach(e => a.push(e))
  t.same(a, [42], 'Set methods work') 

  t.equal(setProxy.getFoo(), 'bar', 'class methods use proxy and not its target')
  t.end()
})
