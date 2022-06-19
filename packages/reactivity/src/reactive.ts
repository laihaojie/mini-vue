import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from './baseHandlers'

export const reactiveMap = new WeakMap()
export const readonlyMap = new WeakMap()
export const shallowReadonlyMap = new WeakMap()

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  RAW = '__v_raw',
}

export function reactive(target) {
  return createReactiveObject(target, reactiveMap, mutableHandlers)
}

export function readonly(target) {
  return createReactiveObject(target, readonlyMap, readonlyHandlers)
}

export function shallowReadonly(target) {
  return createReactiveObject(
    target,
    shallowReadonlyMap,
    shallowReadonlyHandlers,
  )
}

function createReactiveObject(target, proxyMap, baseHandlers) {
  // 利用proxy 初始化响应式对象

  // 如果获取到了值说明已经是响应式对象了
  const existingProxy = proxyMap.get(target)
  if (existingProxy)
    return existingProxy

  // 创建一个新的响应式对象
  const proxy = new Proxy(target, baseHandlers)

  // 将新创建的响应式对象放入map中
  proxyMap.set(target, proxy)
  return proxy
}
