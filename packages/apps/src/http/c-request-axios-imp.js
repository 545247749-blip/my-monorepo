import http from './a-http.js'
import { inject } from './b-request-core.js'

const contentUrl = process.env.NODE_ENV === 'development' ? '/api' : ''


export const requestor = (url) => http.get(contentUrl + url)
