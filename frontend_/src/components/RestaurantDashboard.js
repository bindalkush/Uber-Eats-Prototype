import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RestaurantProfile from './RestaurantProfile';
import RestaurantDishes from './RestaurantDishes';
// import RestaurantOrders from './RestaurantOrdersView';
import '../RestaurantDashboard.css';  // Assuming you have styles for the dashboard
import axios from 'axios';
import RestaurantOrdersView from './RestaurantOrdersView';
import { useSessionToken } from '../store/selector';

const RestaurantDashboard = ({ handleLogout }) => {
  const [activeTab, setActiveTab] = useState('profile');  // Default tab set to 'profile'
  const [userName, setUserName] = useState('');  // Store restaurant username
  const [restaurantDetails, setRestaurantDetails] = useState(null);  // Fetch restaurant details and pass to profile
  const sessionToken = useSessionToken();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      const token = sessionToken;
      if (!token) {
        console.error('No token found, user might not be authenticated.');
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/restaurant-profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Add JWT token to headers
          },
        });
        setUserName(response.data.user.username);
        setRestaurantDetails(response.data);  // Store restaurant details for profile component
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    };

    fetchRestaurantDetails();
  }, []);

  const profilePhoto = restaurantDetails?.profile_picture ? `${process.env.REACT_APP_API_BASE_URL}${restaurantDetails.profile_picture}` : 'https://via.placeholder.com/100';

  return (
    <div className="restaurant-dashboard">
      {/* Welcome area and profile */}
      <div className="profile-area">
        <div className="profile-photo-container">
          <img src={profilePhoto} alt="Profile" className="profile-photo" />
        </div>
        <h2>Welcome, {userName}!</h2> {/* Display restaurant username */}
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
            <button onClick={() => setActiveTab('dishes')} className={activeTab === 'dishes' ? 'active' : ''}>Dishes</button>
          </li>
          <li>
            <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''}>Orders</button>
          </li>
        </ul>
      </nav>



      {/* Render content based on the active tab */}
      <div className="dashboard-content">
        {activeTab === 'profile' && <RestaurantProfile restaurantDetails={restaurantDetails} />}
        {activeTab === 'dishes' && <RestaurantDishes restaurantId={restaurantDetails?.id} />}
        {activeTab === 'orders' && <RestaurantOrdersView />}
      </div>
    </div>
  );
};

      

export default RestaurantDashboard;












