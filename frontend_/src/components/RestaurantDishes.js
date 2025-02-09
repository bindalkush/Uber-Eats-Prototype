import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../RestaurantDishes.css';
import { useSessionToken } from '../store/selector';

const RestaurantDishes = ({ restaurantId }) => {
  const [dishes, setDishes] = useState([]);
  const [newDish, setNewDish] = useState({
    name: '',
    ingredients: '',
    image: '',
    price: '',
    description: '',
    category: '',
  });
  const [categories] = useState(['Appetizer', 'Salad', 'Main Course', 'Dessert', 'Beverage']); // Dish categories
  const [isEditing, setIsEditing] = useState(false);
  const [editDishId, setEditDishId] = useState(null);
  const [showForm, setShowForm] = useState(false);  // Add a state for controlling the form visibility
  const sessionToken = useSessionToken();

  // Create a ref for the form section
  const formRef = useRef(null);

  useEffect(() => {
    if (!restaurantId) {
      return;
    }
    // Fetch the dishes for the current restaurant
    const fetchDishes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/restaurants/${restaurantId}/menu/`);
        setDishes(response.data.menu);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };
    fetchDishes();
  }, [restaurantId]);

  useEffect(() => {
    if (showForm) {
      scrollToForm();
    }
  }, [showForm]);  // Trigger scroll whenever the form is shown

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDish((prevDish) => ({
      ...prevDish,
      [name]: value,
    }));
  };

  // Function to scroll to the form
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleAddDish = () => {
    setIsEditing(false);
    setShowForm(true);  // Show form for adding a new dish
  };

  const handleEditDish = (dish) => {
    setNewDish({
      name: dish.name,
      ingredients: dish.ingredients,
      image: dish.image,
      price: dish.price,
      description: dish.description,
      category: dish.category,
    });
    setIsEditing(true);
    setEditDishId(dish.id);
    setShowForm(true);  // Show form for editing
  };

  const handleSubmitDish = async () => {
    const token = sessionToken
    if (!token) {
      alert('Please log in to proceed.');
      return;
    }

    try {
      if (isEditing) {
        // Update existing dish
        await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/dishes/${editDishId}/edit/`, newDish, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Dish updated successfully!');
        setDishes(dishes.map((dish) => (dish.id === editDishId ? { ...dish, ...newDish } : dish)));
      } else {
        // Add a new dish
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/dishes/add/`, newDish, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Dish added successfully!');
        setDishes([...dishes, response.data]);  // Update the state to show the new dish
      }

      // Reset form after submission
      setNewDish({ name: '', ingredients: '', image: '', price: '', description: '', category: '' });
      setShowForm(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting dish:', error);
      alert('Error submitting dish. Please try again.');
    }
  };

  const groupedDishes = dishes.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {});

  return (
    <div className="restaurant-dishes">
      <h2>Click to add new dish</h2>

      {/* Button to show Add Dish form */}
      <button className="btn btn-primary" onClick={handleAddDish}>
        Add New Dish
      </button>

      <h2>Restaurant Dishes</h2>

      {/* Display Dishes Category-wise */}
      {Object.keys(groupedDishes).map((category) => (
        <div key={category}>
          <h3>{category}</h3>
          <div className="dish-category">
            {groupedDishes[category].map((dish) => (
              <div key={dish.id} className="menu-item">
                {/* Display dish image if available */}
                {dish.image && (
                  <div className="dish-image-container">
                    <img src={dish.image} alt={dish.name} className="dish-image" />
                  </div>
                )}
                <h4>{dish.name}</h4>
                <p>{dish.description}</p>
                <p><strong>Ingredients:</strong> {dish.ingredients}</p>
                <p><strong>Price:</strong> ${dish.price}</p>
                <button className="btn btn-secondary" onClick={() => handleEditDish(dish)}>
                  Edit Dish
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}



      {/* {Object.keys(groupedDishes).map((category) => (
        <div key={category}>
          <h3>{category}</h3>
          <div className="dish-category">
            {groupedDishes[category].map((dish) => (
              <div key={dish.id} className="menu-item">
                <h4>{dish.name}</h4>
                <p>{dish.description}</p>
                <p><strong>Ingredients:</strong> {dish.ingredients}</p>
                <p><strong>Price:</strong> ${dish.price}</p>
                
                {dish.image && (
                  <div className="dish-image-container">
                    <img src={dish.image} alt={dish.name} className="dish-image" />
                  </div>
                )}
                <button className="btn btn-secondary" onClick={() => handleEditDish(dish)}>
                  Edit Dish
                </button>
              </div>
            ))}
          </div>
        </div>
      ))} */}

      {/* Conditionally show Add/Edit Form */}
      {showForm && (
        <div className="add-edit-dish-form" ref={formRef}>
          <h3>{isEditing ? 'Edit Dish' : 'Add New Dish'}</h3>
          <div className="form-group">
            <label>Dish Name:</label>
            <input type="text" name="name" value={newDish.name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Ingredients:</label>
            <input type="text" name="ingredients" value={newDish.ingredients} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Image URL:</label>
            <input type="text" name="image" value={newDish.image} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input type="number" name="price" value={newDish.price} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <input type="text" name="description" value={newDish.description} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select name="category" value={newDish.category} onChange={handleInputChange}>
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button onClick={handleSubmitDish}>
            {isEditing ? 'Update Dish' : 'Add Dish'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantDishes;





