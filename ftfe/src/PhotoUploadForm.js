import './styles/UploadPage.css';
import { useState } from 'react';

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState([]); 
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]); 
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (window.TouchEvent && e instanceof TouchEvent) {
      e.preventDefault();
    }

    if (selectedFiles.length === 0) { 
      setUploadStatus('At least one picture is required');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`files`, file);
    });

    try {
      setUploadStatus(`uploading picture #${selectedFiles.length} ...`);
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
          select pictures
          <input 
            type="file" 
            onChange={handleFileChange} 
            multiple 
            accept="image/*" 
          />
        </label>
        <button onClick={handleUpload} onTouchEnd={handleUpload}>Upload</button>
      </div>
      {selectedFiles.length > 0 && (
        <div className="file-list">
          selected {selectedFiles.length} ：
          {selectedFiles.map((file, i) => (
            <div key={i} className="file-name">{file.name}</div>
          ))}
        </div>
      )}
      {uploadStatus && (
        <p className="upload-status" data-status={uploadStatus}>
          Status：{uploadStatus}
        </p>
      )}
    </div>
  );
}