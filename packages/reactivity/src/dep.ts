// 创建储所有的 effect 对象的Set
export function createDep(effects?) {
  const dep = new Set(effects)
  return dep
}
