import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomerProfile from './CustomerProfile';  // Importing the customer-specific components
import CustomerOrders from './CustomerOrders';
import CustomerFavorites from './CustomerFavorites';
import CustomerCart from './Cart';
import RestaurantList from './RestaurantList'; // Customer's restaurant browsing feature
import '../CustomerDashboard.css'; // Assuming CSS styles are similar to RestaurantDashboard
import axios from 'axios';

import { useSessionToken } from '../store/selector';

const CustomerDashboard = ({ handleLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');  // Default tab is 'profile'
  const [userName, setUserName] = useState('');  // To store the user's name
  const [customerDetails, setCustomerDetails] = useState(null);  // Store customer details for profile component

  
  const sessionToken = useSessionToken();

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const token = sessionToken;
      if (!token) {
        console.error('No token found, user might not be authenticated.');
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`  // Add JWT token in the headers
          }
        });
        setUserName(response.data.user.username);  // Assuming 'username' is part of the user data
        setCustomerDetails(response.data);  // Store customer details for profile component
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };

    fetchCustomerDetails();
  }, []);

  // const profilePhoto = customerDetails?.profile_picture 
  //   ? `https://ubereats-backend-4199107521a9.herokuapp.com${customerDetails.profile_picture}`
  //   : 'https://via.placeholder.com/100';

  const profilePhoto = customerDetails?.profile_picture 
  ? `${process.env.REACT_APP_API_BASE_URL}/media/${customerDetails.profile_picture}`
  : 'https://via.placeholder.com/100';

  return (
    <div className="customer-dashboard">
      {/* Welcome area and profile photo */}
      <div className="profile-area">
        <div className="profile-photo-container">
          <img src={profilePhoto} alt="Profile" className="profile-photo" />
        </div>
        <h2>Welcome, {userName}!</h2> {/* Display customer username */}
      </div>

      {/* Sign out button */}
      <div className="signout-area">
        <button onClick={() => handleLogout()} className="btn btn-primary dashboard-button">
          Sign Out
        </button>
      </div>

      {/* Navigation bar */}
      <nav className="dashboard-nav">
        <ul>
          <li>
            <button onClick={() => setActiveTab('profile')} className={activeTab === 'profile' ? 'active' : ''}>Profile</button>
          </li>
          <li>
            <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>Orders</button>
          </li>
          <li>
            <button onClick={() => setActiveTab('favorites')} className={activeTab === 'favorites' ? 'active' : ''}>Favorites</button>
          </li>
          <li>
            <button onClick={() => setActiveTab('restaurants')} className={activeTab === 'restaurants' ? 'active' : ''}>Restaurants</button>
          </li>
          <li>
            <button onClick={() => setActiveTab('cart')} className={activeTab === 'cart' ? 'active' : ''}>Cart</button>
          </li>
        </ul>
      </nav>

      {/* Render content based on the active tab */}
      <div className="dashboard-content">
        {activeTab === 'profile' && <CustomerProfile customerDetails={customerDetails} />}
        {activeTab === 'orders' && <CustomerOrders />}
        {activeTab === 'favorites' && <CustomerFavorites />}
        {activeTab === 'restaurants' && <RestaurantList />}
        {activeTab === 'cart' && <CustomerCart />}
      </div>
    </div>
  );
};

export default CustomerDashboard;










