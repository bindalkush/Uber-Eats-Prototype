
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom'; 
import '../Login.css'

const CustomerSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    date_of_birth: '',
    city: '',
    state: '',
    country: '',
    nickname: '',
    phone: '',
  });

  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/customer-signup/`, {
        user: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        date_of_birth: formData.date_of_birth,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        nickname: formData.nickname,
        phone: formData.phone,
      },
      { withCredentials: true } // Include cookies for session-based authentication
    );
      console.log('Signup successful', response.data);
      alert('Signup successful! Redirecting to home...');
      setTimeout(() => {
        navigate('/login'); // Redirect to home page after 1 seconds
      }, 1000);
      // Handle successful signup (e.g., redirect to login page)
    } catch (error) {
      if(error.response)
      {
        console.error('**Signup error**', error.response.error);
        alert(`Signup failed: ${error.response.data.detail || 'An error occurred.'}`);
      }
      // Handle signup error (e.g., display error messages)
      else if (error.request) {
        // The request was made but no response was received
        console.error('Signup error: No response received', error.request);
        alert('Signup failed: No response from the server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Signup error:', error.message);
        alert('Signup failed: An unexpected error occurred. Please try again.');
      }

    }
  };

  return (
    <div className="signup-container home-container">
      <div className="signup-box">
        <h1 className="signup-title">Welcome To Uber <span className="title-green">Eats Prototype</span></h1>
        <h2 className="signup-subtitle">Create your customer account</h2>
        <form onSubmit={handleSubmit} className="signup-form">
        <div className="input-container">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="signup-input"
            value={formData.username}
            onChange={handleChange}
            required
          />
          </div>
          <div className="input-container">
          <input
            type="text"
            name="email"
            placeholder="Email"
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
            type="date"
            name="date_of_birth"
            placeholder="Password"
            className="signup-input"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
</div>
<div className="input-container">
          <input
            type="text"
            name="city"
            placeholder="City"
            className="signup-input"
            value={formData.city}
            onChange={handleChange}
            required
          />
          </div>
          <div className="input-container">
          <input
            type="text"
            name="state"
            placeholder="State"
            className="signup-input"
            value={formData.state}
            onChange={handleChange}
            required
          />
          </div>
          <div className="input-container">
            <input
            type="text"
            name="country"
            placeholder="Country"
            className="signup-input"
            value={formData.country}
            onChange={handleChange}
            required
          />
</div>
<div className="input-container">
          <input
            type="text"
            name="nickname"
            placeholder="Nickname"
            className="signup-input"
            value={formData.nickname}
            onChange={handleChange}
            required
          />
            </div>
            <div className="input-container">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="signup-input"
            value={formData.phone}
            onChange={handleChange}
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

export default CustomerSignup;