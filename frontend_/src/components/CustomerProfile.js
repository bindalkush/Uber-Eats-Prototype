import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CustomerProfile.css';  // Assuming you have styles for the customer profile
import { useSessionToken } from '../store/selector'

const CustomerProfile = ({ customerDetails }) => {
  const [details, setDetails] = useState({
    user: {
      username: '',
      email: ''
    },
    date_of_birth: '',
    city: '',
    state: '',
    country: '',
    phone: '',
    profile_picture: '', // Add profile picture field
  });

  const [countries, setCountries] = useState([]);
  const [profileImage, setProfileImage] = useState(null);  // State for the uploaded image
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const sessionToken = useSessionToken();

  useEffect(() => {
    if (customerDetails) {
      setDetails({
        user: {
          username: customerDetails.user.username,
          email: customerDetails.user.email,
        },
        date_of_birth: customerDetails.date_of_birth,
        city: customerDetails.city,
        state: customerDetails.state,
        country: customerDetails.country,
        phone: customerDetails.phone,
        profile_picture: customerDetails.profile_picture, // Set profile picture
      });
    }

    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/countries/`);
        setCountries(response.data);  // Set the fetched countries to state
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();

  }, [customerDetails]);

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
    if (customerDetails) {
      setDetails({
        user: {
          username: customerDetails.user.username,
          email: customerDetails.user.email,
        },
        date_of_birth: customerDetails.date_of_birth,
        city: customerDetails.city,
        state: customerDetails.state,
        country: customerDetails.country,
        phone: customerDetails.phone,
        profile_picture: customerDetails.profile_picture, // Reset profile picture
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
    formData.append('date_of_birth', details.date_of_birth);
    formData.append('city', details.city);
    formData.append('state', details.state);
    formData.append('country', details.country);
    formData.append('phone', details.phone);

    if (details.user.username !== customerDetails.user.username) {
      formData.append('username', details.user.username);
    }

    if (details.user.email !== customerDetails.user.email) {
      formData.append('email', details.user.email);
    }

    if (profileImage) {
      formData.append('profile_picture', profileImage);  // Add profile picture to form data
    }
    window.location.reload();
    console.log('Updating profile with details:', formData);  // Debugging log

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/profile/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,

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
    return `${process.env.REACT_APP_API_BASE_URL}${url}`;  // Template literal for string interpolation
  // If it's a relative URL, prepend the base URL
  };

  return (
    <div className="customer-profile">
      <h2>Customer Profile</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="profile-details">
        {isEditing ? (
          <>
          
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
              <label>Date of Birth:</label>
              <input
                type="date"
                name="date_of_birth"
                value={details.date_of_birth}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>City:</label>
              <input
                type="text"
                name="city"
                value={details.city}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={details.state}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Country:</label>
              <select
                name="country"
                value={details.country}
                onChange={handleInputChange}
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={details.phone}
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
            <p><strong>Username:</strong> {details.user.username}</p>
            <p><strong>Email:</strong> {details.user.email}</p>
            <p><strong>Date of Birth:</strong> {details.date_of_birth}</p>
            <p><strong>City:</strong> {details.city}</p>
            <p><strong>State:</strong> {details.state}</p>
            <p><strong>Country:</strong> {details.country}</p>
            <p><strong>Phone:</strong> {details.phone}</p>
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

export default CustomerProfile;














