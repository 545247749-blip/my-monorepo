import { inject } from './b-request-core.js'
import * as api from './c-request-axios-imp.js'

const busmap = new Map()

const hashRequest = (config) => {

}

export const trackedApi = new Proxy(api, {
  get (target, property) {
    console.log(`访问属性: ${String(property)}`)

    // 获取原始值
    const value = target[property]

    // 如果是函数，进行包装
    if (typeof value === 'function') {
      return function (...args) {
        console.log(`调用函数: ${String(property)}`, args)
        return value.apply(this, args)
      }
    }

    return value
  },
})
