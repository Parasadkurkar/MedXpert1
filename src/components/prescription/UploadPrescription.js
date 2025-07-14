import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const UploadPrescription = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [prescriptionId, setPrescriptionId] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    // 1. DECLARE FIRST
    const formData = new FormData();
    files.forEach(file => formData.append('prescriptions', file));

    try {
      setStatus('uploading');
      setError('');
      
      // 2. USE AFTER DECLARATION
      const res = await api.post('/prescriptions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setStatus('success');
      setPrescriptionId(res.data.prescription.id);
      setTimeout(() => {
        navigate(`/prescription-status/${res.data.prescription.id}`);
      }, 2000);
    } catch (err) {
      setStatus('error');
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload Prescription</h2>
      
      {status === 'success' && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Prescription uploaded successfully! Redirecting to status page...
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="prescriptions">
            Upload Prescription Images (JPG, PNG, PDF)
          </label>
          <input
            type="file"
            id="prescriptions"
            name="prescriptions"
            multiple
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            className="w-full px-3 py-2 border rounded"
          />
          <p className="text-sm text-gray-500 mt-1">Max 5 files, 5MB each</p>
        </div>
        
        {files.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Selected Files:</h3>
            <ul className="list-disc pl-5">
              {Array.from(files).map((file, index) => (
                <li key={index} className="flex justify-between">
                  <span>{file.name}</span>
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <button
          type="submit"
          disabled={status === 'uploading' || files.length === 0}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {status === 'uploading' ? 'Uploading...' : 'Submit Prescription'}
        </button>
      </form>
    </div>
  );
};

export default UploadPrescription;