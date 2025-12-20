import express from 'express'
import multer from 'multer'
const router2 = express.Router()
 
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    // 保持原始文件名，但在前面加时间戳避免重名
    const timestamp = Date.now()
    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8')
    const newName = `${timestamp}-${originalName}`
    cb(null, newName)
  },
})

const upload = multer({ storage })

router2.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    code: '200',
    data: '上传成功',
    message: 'success',
  })
})


export default router2
