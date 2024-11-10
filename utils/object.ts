export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export const deepMerge = <T>(target: T, source: DeepPartial<T>) => {
  const result = { ...target }
  for (const key in source) {
    if (source[key] == null || source[key] == undefined) continue
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key], source[key])
    } else {
      result[key] = source[key] as T[typeof key]
    }
  }
  return result
}
