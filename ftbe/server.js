const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const UPLOAD_DIR = path.join(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// 中间件配置
app.use(cors({
    origin: ['http://localhost:3000','http://192.168.1.101:3000'], // 允许前端地址访问
    methods: ['GET', 'POST']
  }));

app.use('/images', express.static(UPLOAD_DIR));

// 文件上传接口
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未收到文件' });
    }

    // Multer 已自动保存文件，无需手动处理
    res.status(200).json({ 
      message: '文件上传成功',
      filename: req.file.originalname 
    });
  
  } catch (error) {
    console.error('上传错误:', error);
    res.status(500).send('服务器错误');
  }
});

// 在文件上传接口后添加
app.get('/api/images', (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: '无法读取图片目录' });
    }
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    res.json({ images: imageFiles });
  });
});

// 启动服务
const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`文件上传目录：${UPLOAD_DIR}`);
});