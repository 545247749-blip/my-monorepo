
/**
 * @param { Object } obj
 * */
export const observe = (obj) => {
  for (const key in obj) {
    let internalValue = obj[key]
    let funs = new Set()
    Object.defineProperty(obj, key, {
      get () {
        window.__func && funs.add(window.__func)
        return internalValue
      },
      set (val) {
        internalValue = val
        Array.from(funs).forEach(fn => fn())
      },
    })
  }
}

export const autoRun = (fn) => {
  window.__func = fn
  fn()
  window.__func = null
}
