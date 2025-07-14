import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  DocumentTextIcon,
  HomeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import api from '../utils/api';

const Dashboard = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await api.get('/prescriptions');
        setPrescriptions(res.data);
      } catch (err) {
        setError('Failed to load prescriptions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage your prescriptions, orders, and account settings</p>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0 bg-white rounded-xl shadow-md p-4 h-fit">
          <h2 className="text-lg font-bold text-gray-700 mb-4 pl-2">Navigation</h2>
          <nav className="space-y-1">
            <Link 
              to="/dashboard" 
              className="flex items-center p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Dashboard Home
            </Link>
            
            <Link 
              to="/dashboard/prescriptions" 
              className="flex items-center p-3 text-blue-600 bg-blue-50 rounded-lg font-medium"
            >
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Your Prescriptions
            </Link>
            
            <Link 
              to="/dashboard/orders" 
              className="flex items-center p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition"
            >
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              Order History
            </Link>
            
            <Link 
              to="/dashboard/profile" 
              className="flex items-center p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition"
            >
              <UserIcon className="w-5 h-5 mr-2" />
              Account Settings
            </Link>
            
            <Link 
              to="/logout" 
              className="flex items-center p-3 text-gray-700 hover:bg-red-50 rounded-lg transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
              Log Out
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Prescriptions</h2>
            <Link 
              to="/upload-prescription" 
              className="flex items-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              Upload Prescription
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your prescriptions...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              <p className="font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="bg-blue-50 rounded-lg p-8 text-center">
              <DocumentTextIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                You haven't uploaded any prescriptions yet
              </h3>
              <p className="text-gray-600 mb-6">
                Upload your first prescription to get started with your medication orders
              </p>
              <Link 
                to="/upload-prescription" 
                className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
              >
                Upload Your First Prescription
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prescriptions.map(prescription => (
                <div 
                  key={prescription._id} 
                  className="border rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  <div className={`p-4 ${
                    prescription.status === 'APPROVED' ? 'bg-green-50 border-b border-green-100' : 
                    prescription.status === 'REJECTED' ? 'bg-red-50 border-b border-red-100' : 'bg-blue-50 border-b border-blue-100'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${
                        prescription.status === 'APPROVED' ? 'text-green-700' : 
                        prescription.status === 'REJECTED' ? 'text-red-700' : 'text-blue-700'
                      }`}>
                        {prescription.status.charAt(0) + prescription.status.slice(1).toLowerCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-wrap gap-3">
                      {prescription.images.map((image, index) => (
                        <a 
                          key={index} 
                          href={`http://localhost:5000/${image}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <div className="bg-gray-100 border rounded-md w-20 h-20 flex items-center justify-center overflow-hidden">
                            <img 
                              src={`http://localhost:5000/${image}`} 
                              alt={`Prescription ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <p className="mt-1 text-xs text-center text-gray-500">View {index + 1}</p>
                        </a>
                      ))}
                    </div>
                    
                    {prescription.notes && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Notes:</span> {prescription.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;