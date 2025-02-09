


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantDetail from './RestaurantDetail';  // Import the RestaurantDetail component
import '../RestaurantList.css';  // Import the CSS file for styling

import { useSessionToken } from '../store/selector';
import { useSelector, useDispatch } from 'react-redux';


const RestaurantList = () => {
  // const [restaurants, setRestaurants] = useState([]);
  const dispatch = useDispatch();
  const restaurants = useSelector(state => state.counter.restaurants);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [activeRestaurant, setActiveRestaurant] = useState(null);  // State to store active restaurant for detail view
  const sessionToken = useSessionToken();

  // useEffect(() => {
  //   // Fetch restaurant data from the backend
  //   const fetchRestaurants = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/restaurants`);
  //       setRestaurants(response.data);  /// after this dispatch action 
  //       setLoading(false); // Data has loaded
  //     } catch (error) {
  //       console.error('Error fetching restaurants:', error);
  //       setError('Failed to fetch restaurants');
  //       setLoading(false); // Finished loading, but with error
  //     }
  //   };

  //   fetchRestaurants();
  // }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (restaurants.length > 0) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/restaurants`);
        dispatch({ type: 'SET_RESTAURANTS', payload: response.data });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Failed to fetch restaurants');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [dispatch, restaurants]);

  const markAsFavorite = async (restaurantId) => {
    const token = sessionToken;
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/restaurants`,
        { restaurant_id: restaurantId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.message === "Restaurant added to favorites!") {
        alert('Restaurant marked as favorite!');
      } else if (response.data.message === "Restaurant is already marked as favorite") {
        alert('This restaurant is already in your favorites!');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('This restaurant is already in your favorites!');
      } else {
        console.error('Error marking restaurant as favorite:', error);
        setMessage('Failed to mark restaurant as favorite');
      }
    }
  };

  const handleViewMenu = (restaurantId) => {
    setActiveRestaurant(restaurantId);  // Set the active restaurant ID when "View Menu" is clicked
  };

  if (loading) return <p>Loading restaurants...</p>; // Show loading state
  if (error) return <p>{error}</p>; // Show error state

  return (
    <div className="restaurant-list">
      <h2>Restaurants</h2>
      {/* If a restaurant is selected, display the menu; otherwise, show the restaurant list */}
      {activeRestaurant ? (
        <RestaurantDetail restaurantId={activeRestaurant} />  // Display restaurant detail
      ) : (
        <div className="restaurant-grid">
          {restaurants.length === 0 ? (
            <p>No restaurants found.</p> // No data state
          ) : (
            restaurants.map((restaurant) => (
              <div key={restaurant.id} className="restaurant-item">
                {/* Display restaurant image */}
                {/* {restaurant.profile_picture && (
                  <div className="restaurant-image-container">
                    <img
                      src={`https://ubereats-backend-4199107521a9.herokuapp.com${restaurant.profile_picture}`} 
                      alt={restaurant.name} 
                      className="restaurant-image"
                    />
                  </div>
                )} */}
                <div className="restaurant-details">
                  {/* Centered restaurant name */}
                  <h3 className="restaurant-name">{restaurant.name}</h3>
                  <p><strong>Address:</strong> {restaurant.address}</p>
                  <p><strong>Description:</strong> {restaurant.description}</p>
                  <p><strong>Cuisine Type:</strong> {restaurant.cuisine_type}</p>
                </div>

                {/* Centered buttons */}
                <div className="restaurant-buttons">
                  <button onClick={() => handleViewMenu(restaurant.id)} className="btn btn-primary">
                    View Menu
                  </button>
                  <button onClick={() => markAsFavorite(restaurant.id)} className="btn btn-secondary">
                    Mark As Favorite
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {message && <p>{message}</p>} {/* Display any status message */}
    </div>
  );
};

export default RestaurantList;



