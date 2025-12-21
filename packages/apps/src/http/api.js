
import { requestPool } from './request-core.js'

const contentUrl = process.env.NODE_ENV === 'development' ? '/api' : ''

export const requestor = (url) => requestPool.get(contentUrl + url, {
  debounce: true,
  cacheTime: 0,
  retryDelay: 200,
  retryCount: 0,
})

export const postRequestor = (url, data) => requestPool.post(contentUrl + url, data)

export const postRequestor2 = (url, data) => requestPool.post(contentUrl + url, data)

export const uploadFile = (url, data) => requestPool.post(contentUrl + '/upload/upload', data)
