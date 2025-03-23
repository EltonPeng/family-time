const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const FE_PORT = process.env.FE_PORT;
const BE_PORT = process.env.BE_PORT;
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

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

app.use(cors({
    origin: [`http://localhost:${FE_PORT}`,`http://${process.env.LOCAL_IP}:${FE_PORT}`], // 允许前端地址访问
    methods: ['GET', 'POST']
  }));

app.use('/images', express.static(UPLOAD_DIR));

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

const server = app.listen(BE_PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://localhost:${BE_PORT}`);
  console.log(`文件上传目录：${UPLOAD_DIR}`);
});

server.keepAliveTimeout = 60000;
server.headersTimeout = 65000;
server.maxHeadersCount = 1000;