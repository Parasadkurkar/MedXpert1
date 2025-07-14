import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';

const CartPage = () => {
  const { cart, cartTotal, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();

  if (itemCount === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 mx-auto text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          <h2 className="text-2xl font-bold mt-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mt-2">Looks like you haven't added any medicines yet</p>
          <Link 
            to="/browse-medicines" 
            className="mt-6 inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            Browse Medicines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8">Your Cart ({itemCount} items)</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y">
          {cart.map(item => (
            <CartItem 
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>
        
        <div className="p-6 border-t">
          <div className="flex justify-between text-xl font-bold mb-4">
            <span>Total:</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={clearCart}
              className="bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-lg"
            >
              Clear Cart
            </button>
            
            <Link 
              to="/checkout"
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;