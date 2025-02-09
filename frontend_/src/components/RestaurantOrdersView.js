


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../RestaurantOrdersView.css'; // Import the CSS file for this component
import { useSessionToken } from '../store/selector';

import { useDispatch } from 'react-redux';

const RestaurantOrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');  // For filtering orders by status
  const [error, setError] = useState('');
  const sessionToken = useSessionToken();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = sessionToken;
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/restaurant/orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { status: statusFilter }  // Filter by status if provided
        });
        console.log(response.data);
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
      }
    };
    fetchOrders();
  }, [statusFilter]);

  const updateOrderStatus = async (orderId, newStatus, newDeliveryStatus) => {
   
    try {
      const token = sessionToken;
      const orderToUpdate = orders.find((order) => order.id === orderId);
  
      if (!orderToUpdate) {
        setError('Order not found');
        return;
      }
  
      const payload = {
        order_status: newStatus,
        delivery_status: newDeliveryStatus,
        total_price: parseFloat(orderToUpdate.total_price).toFixed(2),
      };
  
      console.log('Payload being sent to the API:', payload);
  
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/restaurant/orders/${orderId}/status/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert('Order status updated');
      
      // Dispatch action to update the order in the Redux store
      dispatch({
        type: 'UPDATE_ORDER_STATUS',
        payload: [{ orderId, newStatus, newDeliveryStatus }]
      });
  
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  // const updateOrderStatus = async (orderId, newStatus, newDeliveryStatus) => {
  //   try {
  //     const token = sessionToken;
  //     // Find the relevant order to include total_price in the payload
  //     const orderToUpdate = orders.find((order) => order.id === orderId);
  
  //     if (!orderToUpdate) {
  //       setError('Order not found');
  //       return;
  //     }
  
  //     const payload = {
  //       order_status: newStatus,
  //       delivery_status: newDeliveryStatus,
  //       total_price: parseFloat(orderToUpdate.total_price).toFixed(2), // Include total_price
  //     };
  
  //     console.log('Payload being sent to the API:', payload); // Debugging log
  
  //     await axios.put(
  //       `${process.env.REACT_APP_API_BASE_URL}/api/restaurant/orders/${orderId}/status/`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  
  //     alert('Order status updated');
  //     setOrders((prevOrders) =>
  //       prevOrders.map((order) =>
  //         order.id === orderId
  //           ? { ...order, order_status: newStatus, delivery_status: newDeliveryStatus }
  //           : order
  //       )
  //     );
  //   } catch (err) {
  //     console.error('Error updating order status:', err);
  //     setError('Failed to update order status');
  //   }
  // };
  

  // const updateOrderStatus = async (orderId, newStatus, newDeliveryStatus) => {
  //   try {
  //     const token = sessionToken;
  //     await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/restaurant/orders/${orderId}/status/`, {
  //       order_status: newStatus,
  //       delivery_status: newDeliveryStatus
  //     }, {
  //       headers: {  
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     alert('Order status updated');
  //     setOrders((prevOrders) => prevOrders.map((order) =>
  //       order.id === orderId 
  //         ? { ...order, order_status: newStatus, delivery_status: newDeliveryStatus } 
  //         : order
  //     ));
  //   } catch (err) {
  //     setError('Failed to update order status');
  //   }
  // };

  return (
    <div className="restaurant-orders-container"> {/* Add a unique class here */}
      <h2>Restaurant Orders</h2>
      <select className="status-filter" onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All</option>
        <option value="New">New</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      {error && <p className="error-message">{error}</p>}
      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-card">
              <div className="order-details">
                <strong>Order ID:</strong> {order.id} <br />
                <ul className="order-items">
                  {(order.ordered_items || []).map((item, index) => (
                    <li key={index} className="order-item">
                      {item.dish_name} - {item.quantity} x ${parseFloat(item.price).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <strong>Total Price:</strong> ${parseFloat(order.total_price).toFixed(2)} <br />
                <strong>Delivery type:</strong> {order.delivery_option} <br />
                <strong>Order Status:</strong> {order.order_status} <br />
                <strong>Delivery Status:</strong> {order.order_delivery_status} <br />
              </div>

              {order.order_status === 'New' && (
                <div className="status-update-section">
                  <h4>Update Order Status</h4>
                  <button onClick={() => updateOrderStatus(order.id, 'Delivered', order.delivery_option === 'pickup' ? 'pick up ready' : 'delivered')} className="status-btn">Mark as Delivered</button>
                  <button onClick={() => updateOrderStatus(order.id, 'Cancelled', order.order_delivery_status)} className="status-btn cancel-btn">Cancel Order</button>
                </div>
              )}

              {order.order_status === 'New' && (
                <div className="delivery-status-section">
                  <h4>Update Delivery Status</h4>
                  <button onClick={() => updateOrderStatus(order.id, order.order_status, 'order received')} className="status-btn">Order Received</button>
                  <button onClick={() => updateOrderStatus(order.id, order.order_status, 'preparing')} className="status-btn">Mark as Preparing</button>
                  {order.delivery_option === 'delivery' && (
                    <button onClick={() => updateOrderStatus(order.id, order.order_status, 'on the way')} className="status-btn">Mark as On the Way</button>
                  )}
                  {order.delivery_option === 'pickup' && (
                    <button onClick={() => updateOrderStatus(order.id, order.order_status, 'pick up ready')} className="status-btn">Pick up Ready</button>
                  )}
                </div>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RestaurantOrdersView;
