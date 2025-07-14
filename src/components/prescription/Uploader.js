import { useState } from 'react';
import axios from 'axios';

const PrescriptionUploader = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle');

  const handleSubmit = async () => {
    const formData = new FormData();
    files.forEach(file => formData.append('prescriptions', file));
    
    try {
      setStatus('uploading');
      await axios.post('/api/prescriptions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="upload-container">
      <input 
        type="file"
        multiple
        onChange={e => setFiles([...e.target.files])}
        accept="image/*,application/pdf"
      />
      
      {files.map((file, i) => (
        <div key={i} className="file-preview">
          <span>{file.name}</span>
          <span>{(file.size / 1024 / 1024).toFixed(2)}MB</span>
        </div>
      ))}

      <button 
        onClick={handleSubmit} 
        disabled={files.length === 0 || status === 'uploading'}
      >
        {status === 'uploading' ? 'Uploading...' : 'Submit Prescription'}
      </button>
    </div>
  );
};