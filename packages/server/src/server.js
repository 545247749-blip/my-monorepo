import dotenv from 'dotenv' 
import app from './app.js'

dotenv.config()

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`
  🚀 服务器已启动！
  📍 本地访问: http://${HOST}:${PORT}
  🌍 网络访问: http://0.0.0.0:${PORT}
  📅 ${new Date().toLocaleString()}
  `)
})

// 优雅关闭服务器
process.on('SIGTERM', () => {
  console.log('SIGTERM 信号收到: 正在优雅关闭 HTTP 服务器')
  server.close(() => {
    console.log('HTTP 服务器已关闭')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT 信号收到: 正在优雅关闭 HTTP 服务器')
  server.close(() => {
    console.log('HTTP 服务器已关闭')
    process.exit(0)
  })
})

// 未捕获异常处理
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason)
  process.exit(1)
})
