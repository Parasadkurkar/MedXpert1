import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const CheckoutPage = () => {
  const { currentUser } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: currentUser?.addresses?.[0]?.street || '',
    city: currentUser?.addresses?.[0]?.city || '',
    state: currentUser?.addresses?.[0]?.state || '',
    zip: currentUser?.addresses?.[0]?.zip || '',
    deliveryDate: '',
    deliveryTime: '',
    paymentMethod: 'cod'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate cart items before processing
      const isValidCart = Array.isArray(cart) && 
        cart.length > 0 &&
        cart.every(item => 
          item && 
          typeof item?.id !== 'undefined' && 
          typeof item?.price === 'number' && 
          typeof item?.quantity === 'number' &&
          !isNaN(item.price) &&
          !isNaN(item.quantity)
        );
      
      if (!isValidCart) {
        throw new Error('Your cart contains invalid items or is empty');
      }

      // Calculate total with delivery charge
      const deliveryCharge = 49;
      const finalTotal = cartTotal + deliveryCharge;

      // Create order data with safe property access
      const orderData = {
        userId: currentUser?.id || '',
        items: cart.map(item => ({
          medicineId: item?.id || '',
          name: item?.name || 'Unknown Product',
          price: item?.price || 0,
          quantity: item?.quantity || 1
        })),
        totalAmount: finalTotal,
        shippingAddress: `${deliveryDetails.address}, ${deliveryDetails.city}, ${deliveryDetails.state} ${deliveryDetails.zip}`,
        deliveryDate: deliveryDetails.deliveryDate,
        deliveryTime: deliveryDetails.deliveryTime,
        paymentMethod: deliveryDetails.paymentMethod
      };
      
      // Send to backend
      await api.post('/orders', orderData);
      
      // Clear cart and redirect
      clearCart();
      navigate('/order-success');
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
      console.error('Checkout Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to safely calculate item price
  const getItemTotal = (item) => {
    const price = item?.price || 0;
    const quantity = item?.quantity || 0;
    return (price * quantity).toFixed(2);
  };
  
  // Safely calculate subtotal
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const price = item?.price || 0;
      const quantity = item?.quantity || 0;
      return sum + (price * quantity);
    }, 0).toFixed(2);
  };
  
  // Calculate total with delivery
  const calculateTotal = () => {
    return (parseFloat(calculateSubtotal()) + 49).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={deliveryDetails.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={deliveryDetails.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={deliveryDetails.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  value={deliveryDetails.zip}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                  pattern="[0-9]{6}"
                  title="6-digit ZIP code"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Delivery Date</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={deliveryDetails.deliveryDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Delivery Time</label>
                  <select
                    name="deliveryTime"
                    value={deliveryDetails.deliveryTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select Time Slot</option>
                    <option value="9am-11am">9:00 AM - 11:00 AM</option>
                    <option value="11am-1pm">11:00 AM - 1:00 PM</option>
                    <option value="1pm-3pm">1:00 PM - 3:00 PM</option>
                    <option value="3pm-5pm">3:00 PM - 5:00 PM</option>
                    <option value="5pm-7pm">5:00 PM - 7:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={deliveryDetails.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Cash on Delivery
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={deliveryDetails.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Credit/Debit Card
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={deliveryDetails.paymentMethod === 'upi'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    UPI
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="border-b pb-4 mb-4">
              {cart && cart.length > 0 ? (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between mb-2">
                    <div>
                      <span className="font-medium">{item?.name || 'Unknown Product'}</span>
                      <span className="text-gray-600 ml-2">x {item?.quantity || 0}</span>
                    </div>
                    <div>₹{getItemTotal(item)}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 py-4">Your cart is empty</p>
              )}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>₹49.00</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2">Delivery Information</h3>
              <p className="text-sm">
                {deliveryDetails.address}, {deliveryDetails.city}, {deliveryDetails.state} - {deliveryDetails.zip}
              </p>
              <p className="text-sm mt-1">
                {deliveryDetails.deliveryDate && (
                  <>
                    Delivery on: {new Date(deliveryDetails.deliveryDate).toLocaleDateString()} 
                    {deliveryDetails.deliveryTime && `, ${deliveryDetails.deliveryTime}`}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CheckoutPage;