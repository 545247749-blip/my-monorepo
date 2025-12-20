import express from 'express' 
const router = express.Router()

// GET 示例
router.get('/users', (req, res) => {
  res.json([
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
  ])
})

// POST 示例
router.post('/users', (req, res) => {
  const { name, email } = req.body

  if (!name || !email) {
    return res.status(400).json({ error: '缺少必要的字段: name 和 email' })
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString(),
  }

  res.status(201).json({
    message: '用户创建成功',
    user: newUser,
  })
})

// 带参数的路由
router.get('/users/:id', (req, res) => {
  const { id } = req.params
  res.json({
    id: parseInt(id),
    name: '示例用户',
    email: 'user@example.com',
  })
})

export default router
