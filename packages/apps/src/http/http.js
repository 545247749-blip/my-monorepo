import axios from 'axios'

const http = axios.create({
  timeout: 30000,
  withCredentials: true,
})

http.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

http.interceptors.response.use((response) => {
  return Promise.resolve(response)
}, (error) => {
  return Promise.reject(error)
})

export default http
