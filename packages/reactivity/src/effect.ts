import { createDep } from './dep'

const activeEffect = undefined
const shouldTrack = false
const targetMap = new WeakMap()

export function track(target, key) {
  if (!isTracking())
    return

  // 根据target获取依赖Map
  let depsMap = targetMap.get(target)
  // 如果没有依赖, 创建一个新的依赖Map
  if (!depsMap)
    targetMap.set(target, (depsMap = new Map()))

  // 根据key获取依赖
  let deps = depsMap.get(key)
  // 如果没有依赖, 创建一个新的依赖
  if (!deps)
    depsMap.set(key, (deps = createDep()))

  // 准备添加依赖
  trackEffects(deps)
}

export function trackEffects(deps) {
  // 用 dep 来存放所有的 effect

  // TODO
  // 这里是一个优化点
  // 先看看这个依赖是不是已经收集了，
  // 已经收集的话，那么就不需要在收集一次了
  // 可能会影响 code path change 的情况
  // 需要每次都 cleanupEffect
  // shouldTrack = !dep.has(activeEffect!);
  if (!deps.has(activeEffect)) {
    deps.add(activeEffect);
    (activeEffect as any).deps.push(deps)
  }
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}
