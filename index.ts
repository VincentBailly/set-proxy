/// <reference types="node" />

export function setHandler<T extends object>(handler: ProxyHandler<T>): ProxyHandler<T> {
  return {
    ...handler,
    get: (target, prop, receiver) => {
      const value = handler.get ? handler.get(target, prop, receiver) : Reflect.get(target, prop, receiver)
      if (typeof value === 'function' && Reflect.get(Set.prototype, value.name) === value) {
        return value.bind(target)
      }
      return value
    }
  }
}
