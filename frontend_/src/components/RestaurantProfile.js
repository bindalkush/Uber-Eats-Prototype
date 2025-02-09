import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../RestaurantProfile.css';  // Assuming you have styles for the restaurant profile
import { useSessionToken } from '../store/selector';

const RestaurantProfile = ({ restaurantDetails }) => {
  const [details, setDetails] = useState({
    user: {
      username: '',
      email: ''
    },
    name: '',
    address: '',
    description: '',
    cuisine_type: '',
    profile_picture: '', // Add profile picture field
  });

  const [profileImage, setProfileImage] = useState(null);  // State for the uploaded image
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const sessionToken = useSessionToken();

  useEffect(() => {
    if (restaurantDetails) {
      setDetails({
        user: {
          username: restaurantDetails.user.username,
          email: restaurantDetails.user.email,
        },
        name: restaurantDetails.name,
        address: restaurantDetails.address,
        description: restaurantDetails.description,
        cuisine_type: restaurantDetails.cuisine_type,
        profile_picture: restaurantDetails.profile_picture, // Set profile picture
      });
    }
  }, [restaurantDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the field is within the 'user' object, update it accordingly
    if (name === 'username' || name === 'email') {
      setDetails((prevDetails) => ({
        ...prevDetails,
        user: {
          ...prevDetails.user,
          [name]: value,
        },
      }));
    } else {
      setDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);  // Capture the selected file
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (restaurantDetails) {
      setDetails({
        user: {
          username: restaurantDetails.user.username,
          email: restaurantDetails.user.email,
        },
        name: restaurantDetails.name,
        address: restaurantDetails.address,
        description: restaurantDetails.description,
        cuisine_type: restaurantDetails.cuisine_type,
        profile_picture: restaurantDetails.profile_picture, // Reset profile picture
      });
    }
  };

  const handleUpdateProfile = async () => {
    const token = sessionToken;
    if (!token) {
      setErrorMessage('No token found. Please login.');
      return;
    }

    const formData = new FormData();
    formData.append('name', details.name);
    formData.append('address', details.address);
    formData.append('description', details.description);
    formData.append('cuisine_type', details.cuisine_type);

    if (details.user.username !== restaurantDetails.user.username) {
      formData.append('username', details.user.username);
    }

    if (details.user.email !== restaurantDetails.user.email) {
      formData.append('email', details.user.email);
    }

    if (profileImage) {
      formData.append('profile_picture', profileImage); // Add profile picture to form data
      window.location.reload();
    }
    window.location.reload();
    console.log('Updating profile with details:', formData);  // Debugging log

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/restaurant-profile/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setIsEditing(false);  // Exit edit mode after saving
      setSuccessMessage('Profile updated successfully!');
      console.log('Profile updated:', response.data);
      setDetails((prevDetails) => ({
        ...prevDetails,
        profile_picture: response.data.profile_picture // Update the profile picture in state
      }));
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error);
      setErrorMessage('Error updating profile. Please try again.');
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
    <div className="restaurant-profile">
      <h2>Restaurant Profile</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="profile-details">
        {isEditing ? (
          <>
            <div className="form-group">
              <label>Restaurant Name:</label>
              <input
                type="text"
                name="name"
                value={details.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={details.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={details.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Cuisine Type:</label>
              <input
                type="text"
                name="cuisine_type"
                value={details.cuisine_type}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={details.user.username}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={details.user.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Profile Picture:</label>
              <input type="file" name="profile_picture" onChange={handleImageChange} />
            </div>

            <button className="btn btn-primary" onClick={handleUpdateProfile}>
              Save Changes
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <p><strong>Restaurant Name:</strong> {details.name}</p>
            <p><strong>Address:</strong> {details.address}</p>
            <p><strong>Description:</strong> {details.description}</p>
            <p><strong>Cuisine Type:</strong> {details.cuisine_type}</p>
            <p><strong>Username:</strong> {details.user.username}</p>
            <p><strong>Email:</strong> {details.user.email}</p>
            {/* <p><strong>Profile Picture:</strong></p>
            {details.profile_picture ? (
              <img src={getImageUrl(details.profile_picture)} alt="Profile" width="100" />
            ) : (
              <p>No profile picture uploaded</p>
            )} */}
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantProfile;






