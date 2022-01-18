const SetIteratorProto = (new Set())[Symbol.iterator]().__proto__

function setHandler(handler = {}) {
  return {
    ...handler,
    get: (target, prop, receiver) => {
      const value = handler.get ? handler.get(target, prop, receiver) : Reflect.get(target, prop, receiver)
      if (typeof value === 'function' && (
        Reflect.get(Set.prototype, value.name) === value ||
        Reflect.get(SetIteratorProto, value.name) === value)
         ) {
        return value.bind(target)
      }
      return value
    }
  }
}

exports.setHandler = setHandler;
