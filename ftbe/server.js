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
    origin: [`http://localhost:${FE_PORT}`,`http://${process.env.LOCAL_IP}:${FE_PORT}`], 
    methods: ['GET', 'POST']
  }));

app.use('/images', express.static(UPLOAD_DIR));

app.post('/upload', upload.array('files'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'no files' });
    }

    const results = req.files.map(file => ({
      filename: file.originalname,
      size: file.size
    }));
    
    res.status(200).json(results);
  
  } catch (error) {
    console.error('uploading error:', error);
    res.status(500).send('server error');
  }
});

app.get('/api/images', (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'cannot read file path' });
    }
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    res.json({ images: imageFiles });
  });
});

const server = app.listen(BE_PORT, '0.0.0.0', () => {
  console.log(`BE server is running http://localhost:${BE_PORT}`);
  console.log(`uploading path：${UPLOAD_DIR}`);
});

server.keepAliveTimeout = 60000;
server.headersTimeout = 65000;
server.maxHeadersCount = 1000;