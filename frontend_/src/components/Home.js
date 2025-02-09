
import React from 'react';
import { Link } from 'react-router-dom';
import '../Home.css'

const Home = () => (
  <div className="home-container"> 
    <h1>Welcome to UberEats Prototype</h1>
    <p>Choose an option to get started:</p>
    <div className="d-flex justify-content-center">
      <Link to="/customer-signup" className="btn btn-primary me-2">Customer Signup</Link>
      <Link to="/restaurant-signup" className="btn btn-secondary">Restaurant Signup</Link>
      {/* <Link to="/signup" className="btn btn-info me-2">Combined Signup</Link> */}
      <Link to="/login" className="btn btn-success">Login</Link>
    </div>
  </div>
);

export default Home;

