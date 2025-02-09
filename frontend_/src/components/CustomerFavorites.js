

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CustomerFavorites.css';  // Make sure this CSS file has appropriate styles
import { useSessionToken } from '../store/selector';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState('');
  const sessionToken = useSessionToken();

  useEffect(() => {
    // Fetch favorite restaurants from the backend
    const fetchFavorites = async () => {
      const token = sessionToken;
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/favorites/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorites(response.data);
      } catch (error) {
        console.error('Error fetching favorite restaurants:', error);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (restaurantId) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/favorites/remove/`,
        { restaurant_id: restaurantId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('Restaurant removed from favorites!');
      setFavorites(favorites.filter((fav) => fav.id !== restaurantId)); // Update list after removal
    } catch (error) {
      console.error('Error removing favorite:', error);
      setMessage('Failed to remove favorite');
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) {
      return url;  // If it's an absolute URL, return as is
    }
    return `${process.env.REACT_APP_API_BASE_URL}${url}`;  // If it's a relative URL, prepend the base URL
  };

  return (
    <div className="favorites-list">
      <h2>Favorite Restaurants</h2>
      {message && <p>{message}</p>}
      {favorites.length === 0 ? (
        <p>No favorite restaurants found.</p>
      ) : (
        <div className="favorites-container">
          {favorites.map((restaurant) => (
            <div key={restaurant.id} className="favorite-item">
              {/* Use the helper function to ensure the image URL is correct */}
              {/* <img src={getImageUrl(restaurant.profile_picture)} alt={restaurant.name} className="restaurant-image" /> */}
              <div className="restaurant-details">
                <h3>{restaurant.name}</h3>
                <p><strong>Address:</strong> {restaurant.address}</p>
                <p><strong>Description:</strong> {restaurant.description}</p>
                <p><strong>Cuisine Type:</strong> {restaurant.cuisine_type}</p>
                <button className="btn btn-danger" onClick={() => removeFavorite(restaurant.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
