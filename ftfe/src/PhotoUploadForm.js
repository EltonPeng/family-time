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
      setUploadStatus('select image');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadStatus('uploading...');
      const response = await fetch(`http://${process.env.REACT_APP_LOCAL_IP}:${process.env.REACT_APP_BE_PORT}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Device-Type': /Mobi/.test(navigator.userAgent) ? 'mobile' : 'desktop'
        }
      });
      
      const result = await response.text();
      try {
        JSON.parse(result);
        setUploadStatus(response.ok ? 'ok' : 'failed');
      } catch {
        throw new Error('server response format error');
      }
    } catch (error) {
      setUploadStatus(error.message || 'failed');
    }
  };

  return (
    <div className="photo-upload-form">
      <div className="photo-upload-form__controls">
        <label className="custom-file-upload">
          Select
          <input type="file" onChange={handleFileChange} />
        </label>
        <button onClick={handleUpload} onTouchEnd={handleUpload}>Upload</button>
      </div>
      {selectedFile && <p className="file-name">selected：{selectedFile.name}</p>}
      {uploadStatus && (
        <p className="upload-status" data-status={uploadStatus}>
          Status：{uploadStatus}
        </p>
      )}
    </div>
  );
}