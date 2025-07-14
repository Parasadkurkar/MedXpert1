import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 bg-red-100 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Your order ID: {order._id}</p>
      </div>
      
      <div className="mb-8 p-4 bg-green-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        
        <div className="divide-y">
          {order.items.map((item, index) => (
            <div key={index} className="py-4 flex justify-between">
              <div>
                <h3 className="font-medium">{item.medicine.name}</h3>
                <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
              </div>
              <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="font-bold">Total:</span>
            <span className="font-bold">₹{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Your order is being processed and will be shipped soon</li>
          <li>You'll receive an email with tracking information</li>
          <li>Estimated delivery: 1-2 business days</li>
        </ul>
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;