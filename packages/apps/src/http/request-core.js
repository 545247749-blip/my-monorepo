import http from './http.js'

/**
 * 请求池管理器
 *
 * @class RequestPool
 * @description 提供请求缓存、防抖、重试等功能的请求池管理类
 *
 * @property {Map} data - 存储请求缓存数据的Map对象
 * @property {Object} data.key - 请求的唯一标识符
 * @property {Promise|null} data.key.promise - 当前正在进行的请求Promise
 * @property {any|null} data.key.response - 缓存的响应数据
 * @property {Error|null} data.key.error - 请求错误信息
 * @property {number} data.key.saveTime - 缓存保存的时间戳
 */

class RequestPool {
  constructor (defaultConfig = {}) {
    this.defaultConfig = defaultConfig
    this.data = new Map()
    this._request = this._request.bind(this)
  }

  // 通用请求方法（内部使用）
  _request (configOrUrl, config = {}) {
    let finalConfig
    if (typeof configOrUrl === 'string') {
      finalConfig = { ...config, url: configOrUrl }
    }
    else {
      finalConfig = { ...configOrUrl }
    }
    finalConfig = { ...this.defaultConfig, ...finalConfig }
    if (finalConfig.method) {
      finalConfig.method = finalConfig.method.toUpperCase()
    }
    let { debounce, cacheTime, retryDelay, retryCount, forceRefresh } = finalConfig
    const key = this._generateKey(finalConfig)
    if (!this.data.has(key)) {
      this.data.set(key, {
        promise: null,
        response: null,
        error: null,
        saveTime: 0,
      })
    }
    const cacheEntry = this.data.get(key)
    // 防抖：如果已经有相同请求在进行中，直接返回该 promise
    if (debounce && cacheEntry.promise) {
      return cacheEntry.promise
    }
    // 缓存：检查是否有有效缓存
    if (!forceRefresh && cacheTime && (Date.now() - cacheEntry.saveTime < cacheTime) && cacheEntry.response) {
      return Promise.resolve(cacheEntry.response)
    }
    // 执行请求（带重试逻辑）
    cacheEntry.promise = this._requestWithRetry(finalConfig, retryDelay, retryCount)
    // 标记 promise 状态（用于防抖判断）
    cacheEntry.promise
      .then(response => {
        cacheEntry.response = response
        cacheEntry.error = null
        cacheEntry.saveTime = Date.now()
      })
      .catch(error => {
        cacheEntry.error = error
        cacheEntry.response = null
      }).finally(() => {
        cacheEntry.promise = null
      })
    return cacheEntry.promise
  }

  async _requestWithRetry (finalConfig, retryDelay = 0, retryCount = 0) {
    retryCount = retryCount + 1
    while (retryCount > 0) {
      retryCount--
      try {
        const response = await http({
          ...finalConfig,
        })
        // 成功则返回，不能和上面的合并
        return response
      }
      catch (error) {
        if (retryCount < 1) {
          return Promise.reject(error)
        }
        if (retryDelay > 0) {
          await this._delay(retryDelay)
        }
      }
    }
  }

  // 延迟函数
  _delay (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 获取key值
  _generateKey (finalConfig) {
    let { method, url, params, data } = finalConfig
    const keyData = {
      m: method,
      u: url,
      p: params || {},
      d: data || null,
    }
    try {
      return JSON.stringify(keyData, (key, value) => {
        if (value instanceof File) {
          return `File:${value.name}:${value.size}`
        }
        if (value instanceof FormData) {
          const entries = []
          value.forEach((val, k) => {
            entries.push(`${k}=${val instanceof File ? `File:${val.name}` : val}`)
          })
          return entries.sort().join('&')
        }
        return value
      })
    }
    catch {
      return `${method}|${url}|${Object.keys(finalConfig.params || {}).length}|${data ? 'hasData' : 'noData'}`
    }
  }
}

const methodsWithoutData = ['get', 'delete', 'head', 'options']
const methodsWithData = ['post', 'put', 'patch']

// 添加不携带请求体的方法（GET, DELETE 等）
methodsWithoutData.forEach(method => {
  RequestPool.prototype[method] = function (url, config = {}) {
    return this._request({
      ...config,
      method,
      url,
    })
  }
})

// 添加携带请求体的方法（POST, PUT, PATCH）
methodsWithData.forEach(method => {
  RequestPool.prototype[method] = function (url, data, config = {}) {
    return this._request({
      ...config,
      method,
      url,
      data,
    })
  }
})

function createInstance (defaultConfig = {}) {
  const context = new RequestPool(defaultConfig)

  /**
   * @param { string | Object } configOrUrl
   * @param { Object } [config]
   * */
  const instance = function (configOrUrl, config) {
    return context._request(configOrUrl, config)
  }
  const allMethods = [...methodsWithoutData, ...methodsWithData]
  allMethods.forEach(method => {
    instance[method] = context[method].bind(context)
  })
  return instance
}

/**
 * 请求配置参数类型定义
 *
 * @typedef {Object} RequestConfig
 * @property {boolean} [debounce=true] - 是否启用防抖，避免重复请求
 * @property {number} [cacheTime=0] - 缓存时间(毫秒)，0表示不缓存
 * @property {number} [retryDelay=0] - 重试延迟时间(毫秒)
 * @property {number} [retryCount=0] - 重试次数
 * @property {boolean} [forceRefresh=false] - 是否强制刷新，忽略缓存
 */

export const requestPool = createInstance({
  debounce: true,
  cacheTime: 0,
  retryDelay: 0,
  retryCount: 0,
  forceRefresh: false,
})
