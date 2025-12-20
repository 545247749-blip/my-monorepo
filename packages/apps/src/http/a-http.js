import axios from 'axios'

const http = axios.create({
  timeout: 120000,
  withCredentials: true,
})

http.interceptors.request.use((config) => {
  console.log(`请求的config：`, config)
  return config
}, (error) => {
  return Promise.reject(error)
})

http.interceptors.response.use((response) => {
  console.log('请求的response返回', response)
  return Promise.resolve(response)
}, (error) => {
  console.log('请求的error返回', error)
})

export default http
