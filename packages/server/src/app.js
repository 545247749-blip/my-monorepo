import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import routes from './routes/index.js'
import multer from 'multer'

const app = express()
const upload = multer()
app.use('/uploads', express.static('uploads'))

app.use(cors())
// 配置特定来源
// app.use(cors({
//   origin: 'https://example.com',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
app.use(helmet())
app.use(compression())
app.use(morgan('dev')) // combined
// 中间件配置
app.use(express.json()) // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })) // 解析 URL 编码请求体
// app.use(logger)

// 基本路由
app.get('/', (req, res) => {
  res.json({
    message: '欢迎使用 Express 服务器',
    status: '运行正常',
    timestamp: new Date().toISOString(),
  })
})

// 在基础路由之后添加
app.use('/', routes)

// 健康检查路由
app.get('/health', (req, res) => {
  setTimeout(() => {
    res.status(200).json({ code: '200', status: 'OK', message: '请求成功', query: req.query })
  }, 3000)
})

// 健康检查路由
app.post('/postBack', upload.none(), (req, res) => {
  setTimeout(() => {
    res.status(200).json({ code: '200', status: 'OK', message: '请求成功', data: req.body })
  }, 3000)
})


// 404 处理
app.use((req, res, next) => {
  res.status(404).json({
    error: '未找到请求的资源',
    path: req.path,
    method: req.method,
  })
})

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

export default app
