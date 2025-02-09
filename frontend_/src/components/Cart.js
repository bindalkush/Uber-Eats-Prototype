

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Cart.css'

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const [address, setAddress] = useState({}); // Input field for new address
  const [savedAddresses, setSavedAddresses] = useState([]); // Existing addresses
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [multipleRestaurantsError, setMultipleRestaurantsError] = useState(false); // Flag for multiple restaurant check

  const [deliveryType, setDeliveryType] = useState('delivery');  // New state for delivery type

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cart/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(response.data.items);
        const total = response.data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
        checkMultipleRestaurants(response.data.items); // Check if items are from multiple restaurants
      } catch (err) {
      }
    };

    const fetchSavedAddresses = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/addresses/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedAddresses(response.data);
      } catch (err) {
        console.error('Error fetching saved addresses:', err);
      }
    };

    fetchCartItems();
    fetchSavedAddresses();
  }, []);

  const checkMultipleRestaurants = (items) => {
    // Get a set of unique restaurant names from the cart items
    const restaurantSet = new Set(items.map(item => item.restaurant_name));
    if (restaurantSet.size > 1) {
      setMultipleRestaurantsError(true); // Multiple restaurants found
    } else {
      setMultipleRestaurantsError(false); // Only one restaurant
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      return; // Don't allow negative or zero quantity
    }
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/cart/update/${itemId}/`, {
        quantity: newQuantity,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update quantity locally
      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      const newTotalPrice = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);
      setTotalPrice(newTotalPrice);  // Recalculate total price after quantity change
      checkMultipleRestaurants(updatedItems); // Recheck for multiple restaurants
    } catch (err) {
      setErrorMessage('Failed to update quantity.');
    }
  };

  const removeFromCart = async (itemId) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/cart/remove/${itemId}/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Remove item locally
      const updatedCartItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCartItems);
      const newTotalPrice = updatedCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      setTotalPrice(newTotalPrice);  // Update total price after removal
      alert('Item removed from cart successfully.');
      checkMultipleRestaurants(updatedCartItems); // Recheck for multiple restaurants
    } catch (err) {
      setErrorMessage('Failed to remove item from cart.');
    }
  };

  const finalizeOrder = async () => {
    if (multipleRestaurantsError) {
      alert('Your cart contains dishes from multiple restaurants. Please clear the cart or only order from one restaurant.');
      return; // Prevent checkout if multiple restaurants are found
    }

    const token = localStorage.getItem('access_token');
    const data = {
      delivery_type: deliveryType,  // Add delivery type to the request
      ...(selectedAddress ? { address_id: selectedAddress } : { new_address: address }),  // Include address if delivery
      checkout_items: cartItems.map(item => ({
        ...item,
        price: parseFloat(item.price).toFixed(2), // Ensure price is a valid decimal string
      })),
      total_price: parseFloat(totalPrice).toFixed(2),   
    };

    if (deliveryType === 'Delivery' && !selectedAddress && !address) {
      setErrorMessage('Please provide a delivery address');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/cart/finalize/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Checked Out successfully!');
      setSuccessMessage('Order placed successfully!');
      setCartItems([]);  // Clear the cart after order is finalized
      setTotalPrice(0);  // Reset the total price
      setSelectedAddress(null); // Reset selected address
      setAddress({});  // Clear the input address
    } catch (err) {
      setErrorMessage('Failed to finalize order');
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {multipleRestaurantsError && <p style={{ color: 'red' }}>You cannot checkout items from multiple restaurants.</p>}

      {cartItems && cartItems.length > 0 ? (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                <h3>Restaurant: {item.restaurant_name}</h3> {/* Display restaurant name */}
                <p>{item.dish_name} - {item.quantity} x ${item.price}</p>
                <div>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <h3>Total Price: ${totalPrice.toFixed(2)}</h3>

          {/* Delivery Type Selection */}
          <div>
            <h3>Select Delivery Type</h3>
            <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>

          {/* Show Address fields only if Delivery is selected */}
          {deliveryType === 'delivery' && (
            <div>
              <h3>Delivery Address</h3>
              {savedAddresses.length > 0 && (
                <div>
                  <label>Select Saved Address:</label>
                  <select onChange={(e) => setSelectedAddress(e.target.value)}>
                    <option value="">Select Existing Address</option>
                    {savedAddresses.map((address, index) => (
                      <option key={index} value={address.id}>
                        {address.address}, {address.city}, {address.state}, {address.postal_code}, {address.country}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label>Or Enter a New Address:</label>
                <textarea
                  value={selectedAddress ?
                    savedAddresses.find(addr => addr.id === selectedAddress)?.address || '' // Show selected address details
                    : address.address
                  }
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  placeholder="Enter delivery address"
                />
              </div>
            </div>
          )}

          <button onClick={finalizeOrder}>Checkout</button>
        </>
      ) : (
        <>
          <p>Your cart is empty.</p>
          {/* Hide the checkout form and address section if cart is empty */}
        </>
      )}
    </div>
  );
};

export default Cart;

