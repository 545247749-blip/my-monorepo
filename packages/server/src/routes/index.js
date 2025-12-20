import express from 'express'
import apiRouter from './api.js'
import apiUpload from './upload.js'

const router = express.Router()

// API 路由
router.use('/api', apiRouter)
 
// 版本控制示例
router.use('/upload', apiUpload)

export default router
