import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const PrescriptionStatus = () => {
  const { id } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await api.get(`/prescriptions/${id}`);
        setPrescription(res.data);
      } catch (err) {
        setError('Failed to load prescription details');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
    
    // Refresh status every 30 seconds
    const interval = setInterval(fetchPrescription, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Loading prescription details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-red-100 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Prescription Status</h2>
      
      <div className="mb-6 p-4 border rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Prescription #{prescription._id.slice(-6)}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            prescription.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
            prescription.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {prescription.status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-600">Upload Date</p>
            <p>{new Date(prescription.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Expiry Date</p>
            <p>{new Date(prescription.expiresAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        {prescription.notes && (
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-yellow-700">{prescription.notes}</p>
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Uploaded Files</h3>
        <div className="grid grid-cols-3 gap-3">
          {prescription.images.map((image, index) => (
            <a 
              key={index} 
              href={`http://localhost:5000/${image}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="border rounded-lg overflow-hidden"
            >
              <div className="bg-gray-200 h-32 flex items-center justify-center">
                {image.endsWith('.pdf') ? (
                  <div className="text-center p-2">
                    <div className="text-4xl">📄</div>
                    <p className="text-xs mt-1">PDF Document</p>
                  </div>
                ) : (
                  <img 
                    src={`http://localhost:5000/${image}`} 
                    alt={`Prescription ${index + 1}`}
                    className="object-contain h-full w-full"
                  />
                )}
              </div>
              <p className="text-xs p-2 truncate">{image.split('/').pop()}</p>
            </a>
          ))}
        </div>
      </div>
      
      {prescription.status === 'APPROVED' && (
        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/browse-medicines')}
            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700"
          >
            Browse Approved Medicines
          </button>
        </div>
      )}
    </div>
  );
};

export default PrescriptionStatus;