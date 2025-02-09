import { Provider } from 'react-redux';
import store from './store/store.js';

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CustomerSignup from './components/CustomerSignup';
import RestaurantSignup from './components/RestaurantSignup';
// import CombinedSignup  from './components/CombinedSignup';
import Login  from './components/Login';
import Orders from './components/CustomerOrders';        
import Favorites from './components/CustomerFavorites';         // Adjust the path if necessary
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import Cart from './components/Cart';
import Home from './components/Home';


import CustomerDashboard from './components/CustomerDashboard';
import RestaurantDashboard from './components/RestaurantDashboard';
import RestaurantProfile from './components/RestaurantProfile';  // Import RestaurantProfile
import RestaurantDishes from './components/RestaurantDishes';    // Import RestaurantDishes
import RestaurantOrdersView from './components/RestaurantOrdersView'; 

import './App.css';  // Assuming you have styles for the overall app


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    window.location.href = '/login';  // Redirect to login on logout
  };

  return (
    <Provider store={store}>
    <Router>
      
      <div className="App">
        
        {!isAuthenticated && (  // Show these links only if the user is NOT authenticated
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              {/* <Link className="navbar-brand" to="/">UberEats Prototype</Link>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link" to="/customer-signup">Customer Signup</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/restaurant-signup">Restaurant Signup</Link>
                  </li>
          
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                </ul>
                

              </div> */}
            </div>
          </nav>
        )}

                

        <div className="container mt-4">
          <Routes>
          <Route path="/" element={<Home />} /> {/* Add Home route */}
            <Route path="/customer-signup" element={<CustomerSignup />} />
            <Route path="/restaurant-signup" element={<RestaurantSignup />} />
            {/* <Route path="/signup" element={<CombinedSignup />} /> */}
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            
            
            {/* Customer Dashboard route after login */}
            <Route path="/customer-dashboard" element={<CustomerDashboard handleLogout={handleLogout} />} />
            <Route path="/customer-dashboard/orders" element={<Orders />} />
            <Route path="/customer-dashboard/favorites" element={<Favorites />} />
            <Route path="/customer-dashboard/restaurants" element={<RestaurantList />} />
            <Route path="/restaurant/:id/menu" element={<RestaurantDetail />} /> 
            <Route path="/customer-dashboard/cart" element={<Cart />} />

            
            {/* Restaurant Dashboard routes after login */}
            <Route path="/restaurant-dashboard" element={<RestaurantDashboard handleLogout={handleLogout} />} />
            <Route path="/restaurant-dashboard/profile" element={<RestaurantProfile />} />
            <Route path="/restaurant-dashboard/dishes" element={<RestaurantDishes />} />
            <Route path="/restaurant-dashboard/orders" element={<RestaurantOrdersView />} />
            


          </Routes>
        </div>
      </div>
    </Router>
    </Provider>
  );
}

export default App;
