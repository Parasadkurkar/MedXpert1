import { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth(); // Your auth context

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios.get(`/api/orders/user/${user.id}`);
      setOrders(response.data);
    };
    
    fetchOrders();
  }, [user.id]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      {orders.map(order => (
        <div key={order._id} className="mb-8 p-4 border rounded-lg shadow-sm">
          <div className="flex justify-between mb-2">
            <span>Order #{order._id.substring(0, 8)}</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {order.items.map(item => (
              <div key={item.medicineId._id} className="flex items-center p-2 border">
                <img 
                  src={item.medicineId.image} 
                  alt={item.name} 
                  className="w-16 h-16 object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p>{item.quantity} × ₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-2 border-t flex justify-between">
            <span>Total: ₹{order.totalAmount}</span>
            <span className={`badge ${order.status === 'Delivered' ? 'bg-green-100' : 'bg-yellow-100'}`}>
              {order.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};