type AnyFunction = (...args: any[]) => any

export const proxy = <T extends object, K extends keyof T>(
  source: T,
  method: K,
  callback: (this: T, returned: ReturnType<T[K] & AnyFunction>) => void
) => {
  const original = source[method] as AnyFunction
  source[method] = function (this: T, ...args: Parameters<AnyFunction>) {
    const returned = original.apply(this, args)
    callback.call(this, returned)
    return returned
  } as T[K]
}
