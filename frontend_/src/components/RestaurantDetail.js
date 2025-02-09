

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useSessionToken } from '../store/selector';

import { useSelector, useDispatch } from 'react-redux';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px', // Adjust the width of the modal
    height: '200px', // Adjust the height of the modal
    padding: '20px', // Padding inside the modal
    borderRadius: '10px', // Rounded corners
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for depth
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
};

const RestaurantDetail = ({ restaurantId }) => {
  const dispatch = useDispatch();
  const menu = useSelector(state => state.counter.menu);
const { id } = useParams();
const navigate = useNavigate();

const [restaurant, setRestaurant] = useState(null);
const [message, setMessage] = useState("");
const [cartRestaurantId, setCartRestaurantId] = useState(null);
const [cartRestaurantName, setCartRestaurantName] = useState(null); // Track the restaurant in the current cart

const [showModal, setShowModal] = useState(false); // Modal for confirmation
const [selectedDish, setSelectedDish] = useState(null); // Keep track of the selected dish
const sessionToken = useSessionToken();



  useEffect(() => {
    // Fetch menu for the restaurant from the backend
    const fetchMenu = async () => {
      if (menu.length > 0) {
        // If menu is already in Redux store, use it
        if (menu.length === 0) {
          setMessage("No menu available for this restaurant.");
        }
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/restaurants/${restaurantId}/menu/`
        );
        if (response.data.menu.length === 0) {
          setMessage("No menu available for this restaurant.");
        }
        setRestaurant(response.data.restaurant);
        dispatch({ type: 'SET_MENU', payload: response.data.menu });
      } catch (error) {
        console.error("Error fetching menu:", error);
        setMessage("Error fetching menu. Please try again later.");
      }
    };
    //   try {
    //     const response = await axios.get(
    //       `${process.env.REACT_APP_API_BASE_URL}/api/restaurants/${restaurantId}/menu/`
    //     );
    //     if (response.data.menu.length === 0) {
    //       setMessage("No menu available for this restaurant.");
    //     }
    //     setRestaurant(response.data.restaurant);
    //     setMenu(response.data.menu);

    
    //   } catch (error) {
    //     console.error("Error fetching menu:", error);
    //   }
    // };

    const checkCart = async () => {
      const token = sessionToken;
      if (!token) {
        console.error("No access token found. Please login.");
        return; // If there's no token, the user isn't authenticated
      }
      try {
        const cartResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/cart/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("checking cart");
        console.log("Full cart response:", cartResponse.data);

        if (cartResponse.data.items.length > 0) {
          console.log("First item in cart:", cartResponse.data.items[0]);

          const restaurantName = cartResponse.data.items[0].restaurant_name;
          console.log("Restaurant ID from cart item:", restaurantName);

          if (restaurantName) {
            setCartRestaurantName(restaurantName);
          }

          // Assuming the cart includes restaurant ID
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchMenu();
    checkCart();
  }, [id, dispatch, menu]);

  const handleAddToCart = async (dishId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please log in to add a dish to the cart.");
      return;
    }

    try {
      // If cart contains items from another restaurant, confirm before adding the dish
      if (cartRestaurantName && cartRestaurantName !== dishId.restaurant_name) {
        // If the cart contains items from another restaurant, show confirmation dialog
        setSelectedDish(dishId); // Store the selected dish
        setShowModal(true); // Show confirmation modal
        return; // Don't add the dish to the cart yet
      }

      // If no conflict, add dish to the cart directly

      await addDishToCart(dishId);
      alert("Dish added to cart successfully");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding dish to cart.");
    }
  };

  const groupedDishes = menu.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {});

  const addDishToCart = async (dishId) => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/cart/add/`,
        {
          dish_id: dishId.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCartRestaurantName(dishId.restaurant_name); // Update the cart restaurant ID after adding the dish
    } catch (error) {
      console.error("Error adding dish to cart:", error);
    }
  };

  const handleConfirmReplaceCart = async () => {
    const token = localStorage.getItem("access_token");
    try {
      // Clear the current cart
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/cart/clear/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Add the selected dish to the cart after clearing
      await addDishToCart(selectedDish);

      setShowModal(false); // Close the confirmation modal
      alert("Cart replaced and dish added successfully.");
    } catch (error) {
      console.error("Error replacing cart items:", error);
      alert("Error replacing cart items.");
    }
  };

  const handleCancelReplaceCart = () => {
    setShowModal(false); // Close the confirmation modal without adding the dish
  };

  return (
    <div className="restaurant-detail">
      <h2>{restaurant?.name} Menu</h2>

      {message ? (
        <p>{message}</p>
      ) : (
        Object.keys(groupedDishes).map((category) => (
          <div key={category}>
            <h3 className="category-header">{category}</h3>
            <div className="menu-grid">
              {groupedDishes[category].map((dishId) => (
                <div key={dishId.id} className="menu-item">
                  <div className="dish-image-container">
                    <img
                      src={dishId.image}
                      alt={dishId.name}
                      className="dish-image"
                    />
                  </div>
                  <h4>{dishId.name}</h4>
                  <p>{dishId.description}</p>
                  <p>
                    <strong>Ingredients:</strong> {dishId.ingredients}
                  </p>
                  <p>
                    <strong>Price:</strong> $
                    {parseFloat(dishId.price).toFixed(2)}
                  </p>
                  <button
                    className="btn"
                    onClick={() => handleAddToCart(dishId)}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Confirmation Modal */}
      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} style={customStyles}>
        <h4>Replace Cart Items?</h4>
        <p>
          Your cart already contains items from another restaurant. Do you want
          to replace them with items from{" "}
          {restaurant ? restaurant.name : "this restaurant"}?
        </p>
        <button onClick={handleConfirmReplaceCart} className="btn btn-primary">
          Yes, Replace
        </button>
        <button onClick={handleCancelReplaceCart} className="btn btn-secondary">
          No, Keep Current Cart
        </button>
      </Modal>
    </div>
  );
};

export default RestaurantDetail;
