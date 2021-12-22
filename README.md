# Set proxy

## Description

JavaScript proxy objects don't work with sets because they have native properties that are not proxied.
This library make them work.

## Usage

```javascript

const { setHandler } = require('set-proxy')

const handler = {
  get: (target, prop, receiver) => {
    if (prop === 'foo') {
      return 'bar'
    }
    return Reflect.get(target, prop, receiver)
  }
}
const newHandler = setHandler(handler)

const nativeProxy = new Proxy(new Set([42]), handler)
const setProxy = new Proxy(new Set([42]), newHandler)

console.log(nativeProxy.foo)
// => bar
console.log(nativeProxy.forEach(e => console.log(e)))
// => throws
//    Uncaught TypeError: Method Set.prototype.forEach called on incompatible receiver #<Set>
//        at Proxy.forEach (<anonymous>)

console.log(setProxy.foo)
// => bar
console.log(setProxy.forEach(e => console.log(e)))
// => 42


```

## API

### setHandler(handler)

The input is a [proxy handler](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy).

Returns a new proxy handler which wraps the input in a handler which make proxies work with sets.

