import './styles/UploadPage.css';
import { useState } from 'react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (window.TouchEvent && e instanceof TouchEvent) {
      e.preventDefault();
    }

    if (!selectedFile) {
      setUploadStatus('请先选择文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadStatus('上传中...');
      const response = await fetch(`http://${process.env.REACT_APP_LOCAL_IP}:${process.env.REACT_APP_BE_PORT}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Device-Type': /Mobi/.test(navigator.userAgent) ? 'mobile' : 'desktop'
        }
      });
      
      // 保持原有响应处理逻辑
      const result = await response.text();
      try {
        JSON.parse(result);
        setUploadStatus(response.ok ? '上传成功' : '上传失败');
      } catch {
        throw new Error('服务器响应格式错误');
      }
    } catch (error) {
      setUploadStatus(error.message || '上传失败');
    }
  };

  return (
    <div className="photo-upload-form">
      <div className="photo-upload-form__controls">
        <label className="custom-file-upload">
          选择文件
          <input type="file" onChange={handleFileChange} />
        </label>
        <button onClick={handleUpload} onTouchEnd={handleUpload}>上传文件</button>
      </div>
      {selectedFile && <p className="file-name">已选择文件：{selectedFile.name}</p>}
      {uploadStatus && (
        <p className="upload-status" data-status={uploadStatus}>
          状态：{uploadStatus}
        </p>
      )}
    </div>
  );
}