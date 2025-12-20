import express from 'express'
import morgan from 'morgan' 
import { createProxyMiddleware } from 'http-proxy-middleware'

process.removeAllListeners('warning')

const app = express()

app.use(morgan('dev'))
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,

}))

app.listen(3001, () => console.log('🚀 代理运行在 http://localhost:3001'))
