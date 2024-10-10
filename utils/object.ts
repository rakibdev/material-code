export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export const deepMerge = <Target extends Record<string, any>>(target: Target, source: DeepPartial<Target>) => {
  const result = { ...target }
  for (const [key, value] of Object.entries(source)) {
    if (value == null || value == undefined) continue
    if (typeof value == 'object' && typeof target[key] == 'object' && !Array.isArray(value))
      (result[key] as object) = deepMerge(target[key], value)
    else (result[key] as any) = value
  }
  return result
}
