

import React, { useState } from 'react';
import axios from 'axios'; // Use axios for HTTP requests
import { useNavigate,Link} from 'react-router-dom';
import '../Login.css'


const RestaurantSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    description: '',
    cuisine_type: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData); // Log form data for debugging
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/restaurant-signup/`, {
        user: {
          username: formData.name,  // Assuming the restaurant name is used as the username
          email: formData.email,
          password: formData.password,
        },
        name: formData.name,  // Restaurant name
        address: formData.address,  // Address field (matches the backend model)
        description: formData.description,  // Optional description
        cuisine_type: formData.cuisine_type,  // Cuisine type
      },
      { withCredentials: true } // Include cookies for session-based authentication
    );

      console.log('Signup successful', response.data);
      alert('Restaurant signup successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login'); // Redirect to login after successful signup
      }, 1000);
    } catch (error) {
      if (error.response) {
        console.error('Signup error:', error.response.data);
        setErrorMessage(error.response.data.detail || 'An error occurred during signup.');
      } else if (error.request) {
        console.error('Signup error: No response received', error.request);
        setErrorMessage('No response from the server. Please try again later.');
      } else {
        console.error('Signup error:', error.message);
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="signup-container home-container">
      <div className="signup-box">
        <h1 className="signup-title">Welcome To Uber <span className="title-green">Eats Prototype</span></h1>
        <h2 className="signup-subtitle">Create your Restaurant account</h2>
        <form onSubmit={handleSubmit} className="signup-form">
        <div className="input-container">
        <input
            type="text"
            className="form-control"
            placeholder='Name'
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          </div>
          <div className="input-container">
          <input
            type="email"
            name="email"
            placeholder='Email'
            className="signup-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
          <div className="input-container">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="signup-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        
        </div>
        <div className="input-container">
          <input
            type="text"
            name="address"
            placeholder="Adddress"
            className="signup-input"
            value={formData.address}
            onChange={handleChange}
            required
          />
</div>
<div className="input-container">
          <input
            type="text"
            name="description"
            placeholder="Description"
            className="signup-input"
            value={formData.description}
            onChange={handleChange}
            required
          />
          </div>
          <div className="input-container">
          <input
            type="text"
            name="cuisine_type"
            placeholder="Cuisine_type"
            className="signup-input"
            value={formData.cuisine_type}
            onChange={handleChange}
            required
          />
          </div>
          
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p className="signup-login">
          Already have an account? <Link to="/login" className="login-link">Login</Link>
        </p>
        <p className="signup-home">
          <Link to="/" className="home-link">Go back to Home Page</Link>
        </p>
      </div>
    </div>
  );
};

export default RestaurantSignup;