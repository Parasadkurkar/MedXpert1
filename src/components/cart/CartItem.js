import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const price = item?.price ?? 0;
  const quantity = item?.quantity ?? 1;

  return (
    <div className="p-4 flex items-center">
      <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
        {item?.image ? (
          <img 
            src={item.image} 
            alt={item.name} 
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="text-2xl">💊</div>
        )}
      </div>
      
      {/* <div className="ml-4 flex-grow">
        <h3 className="font-medium text-lg">{item?.name || 'Unnamed Medicine'}</h3>
        <p className="text-gray-600">₹{price.toFixed(2)}</p>
      </div> */}
      
      <div className="ml-4 flex items-center">
        <button 
          onClick={() => {
            if (quantity > 1) {
              onUpdateQuantity(item.id, quantity - 1);
            } else {
              onRemove(item.id);
            }
          }}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-l"
        >
          -
        </button>
        
        <input 
          type="number" 
          min="1" 
          value={quantity}
          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
          className="w-12 h-8 text-center border-y"
        />
        
        <button 
          onClick={() => onUpdateQuantity(item.id, quantity + 1)}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-r"
        >
          +
        </button>
      </div>
      
      <div className="ml-6">
        <p className="font-medium">₹{(price * quantity).toFixed(2)}</p>
      </div>
      
      <button 
        onClick={() => onRemove(item.id)}
        className="ml-6 text-red-600 hover:text-red-800"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
          />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;
