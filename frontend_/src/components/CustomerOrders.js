

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CustomerOrders.css';  // Make sure this CSS file is linked properly
import { useSessionToken } from '../store/selector';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const sessionToken = useSessionToken();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionToken;
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="customer-orders-container"> {/* Apply custom container class */}
      <h2>Your Orders</h2>
      {error && <p>{error}</p>}
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul className="customer-orders-list">  {/* Apply custom list class */}
          {orders.map((order) => (
            <li key={order.id}>
              <strong>Order ID:</strong> {order.id} <br />
              <strong>Restaurant:</strong> {order.restaurant_name || 'Unknown'} <br />
              <strong>Total Price:</strong> ${typeof order.total_price === 'string' ? parseFloat(order.total_price).toFixed(2) : order.total_price.toFixed(2)} <br />
              <strong>Delivery Address:</strong> {order.delivery_address || 'N/A'} <br />
              <strong>Order Status:</strong> {order.order_status || 'N/A'} <br />
              <strong>Delivery type:</strong> {order.delivery_option || 'N/A'} <br />
              <strong>Order Delivery status:</strong> {order.order_delivery_status || 'N/A'} <br />

              <strong>Order Items:</strong>
              <ul className="order-items-list">  {/* Apply custom items list class */}
                {(order.ordered_items || []).map((item, index) => (
                  <li key={index}>
                    {item.dish_name} - {item.quantity} x ${parseFloat(item.price).toFixed(2)}
                  </li>
                ))}
              </ul>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerOrders;









