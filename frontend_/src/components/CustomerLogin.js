import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomerLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/login/`, formData);
      console.log('Login successful', response.data);
      
      // Save JWT token (if using JWT)
      localStorage.setItem('access_token', response.data.access);
      
      // Redirect to customer dashboard
      navigate('/customer-dashboard');  // Redirect to dashboard on success
    } catch (error) {
      console.error('Login error', error.response.data);
      // Display error message to the user
    }
  };

  return (
    <div>
      <h2>Customer Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default CustomerLogin;
