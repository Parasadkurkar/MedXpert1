import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="text-green-500 text-6xl mb-4">✓</div>
      <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
      <p className="mb-8">Your medicines will arrive soon. Track your order in your dashboard.</p>
      <div className="flex justify-center gap-4">
        <Link 
          to="/" 
          className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Continue Shopping
        </Link>
        <Link 
          to="/dashboard/orders" 
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;