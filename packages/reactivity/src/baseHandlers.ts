import { isObject } from 'shared'
import { track } from './effect'
import { reactive, readonly, readonlyMap, shallowReadonlyMap } from './reactive'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)

    // 如果不是readonly才收集依赖
    if (!isReadonly)
      track(target, key)

    if (isShallow)
      return res

    // 如果获取的是一个对象的话, 就继续把它变成响应式对象
    if (isObject(res))
      return isReadonly ? readonly(res) : reactive(res)

    return res
  }
}

function createSetter() {

}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    // readonly 的响应式对象不可以修改值
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target,
    )
    return true
  },
}

export const mutableHandlers = {
  get,
  set,
}

export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set(target, key) {
    // readonly 的响应式对象不可以修改值
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target,
    )
    return true
  },
}
