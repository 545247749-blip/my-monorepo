import http from './a-http.js'

class RequestDeduplicator {
  constructor () {
    this.pending = new Map()
  }

  request (url, config = {}) {
    const key = this._generateKey(url, config)

    if (this.pending.has(key)) {
      return this.pending.get(key)
    }

    const promise = http({
      url,
      method: 'get',
      ...config,
    }).finally(() => {
      this.pending.delete(key)
    }) 

    this.pending.set(key, promise)
    return promise
  }

  _generateKey (url, config) {
    return JSON.stringify({
      url,
      method: config.method || 'get',
      params: config.params || {},
      data: config.data || {},
    })
  }

  // 可选的：手动清除特定请求
  clear (url, config) {
    const key = this._generateKey(url, config)
    this.pending.delete(key)
  }

  // 清除所有缓存
  clearAll () {
    this.pending.clear()
  }
}

export const requestDeduplicator = new RequestDeduplicator()
