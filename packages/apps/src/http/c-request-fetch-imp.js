import http from './a-http.js'
const contentUrl = process.env.NODE_ENV === 'development' ? '/api' : ''


export const requestor = (url, options) => fetch(contentUrl + url, options)
