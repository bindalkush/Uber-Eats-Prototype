import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../Login.css'
import { useDispatch } from 'react-redux';
import { useSessionToken } from '../store/selector'

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userType, setUserType] = useState('');
  const dispatch = useDispatch();
  const sessionToken = useSessionToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionToken) {
      if (userType === 'customer') {
        navigate('/customer-dashboard');
      } else if (userType === 'restaurant') {
        navigate('/restaurant-dashboard');
      }
    }
  }, [sessionToken, userType, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/login/`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('Login successful:', response.data);
        setSuccess(response.data.message);
        setUserType(response.data.user_type);

        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        setIsAuthenticated(true);
        dispatch({ type: 'SET_SESSION_TOKEN', payload: response.data.access});
      })
      .catch(error => {
        console.error('Error logging in:', error);
        if (error.response && error.response.data) {
          setError(error.response.data.error);
        } else {
          setError('An error occurred during login.');
        }
      });
  };

  return (
    <div className = 'home-container'>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p><strong>Don't have an account? </strong><Link to="/">Create a new User</Link></p>
    </div>
  );
};


export default Login;








// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import '../Login.css'
// import { useDispatch } from 'react-redux';
// import { useSessionToken} from '../store/selector'

// const Login = ({ setIsAuthenticated }) => {  // setIsAuthenticated passed as prop
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [userType, setUserType] = useState('');
//   const dispatch = useDispatch();
//   const sessionToken = useSessionToken();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/login/`, formData, {
//       withCredentials: true, // Include cookies for session-based authentication
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then(response => {
//         console.log('Login successful:', response.data);
//         setSuccess(response.data.message);
//         setUserType(response.data.user_type);

//         localStorage.setItem('access_token', response.data.access);
//         localStorage.setItem('refresh_token', response.data.refresh);

//         setIsAuthenticated(true);  // Update authentication state
//         dispatch({ type: 'SET_SESSION_TOKEN', payload: response.data.access});


//         // Redirect based on user type
//         if (response.data.user_type === 'customer' && sessionToken) {
//           console.log("test")
//           window.location.href = '/customer-dashboard';
//         } else if (response.data.user_type === 'restaurant') {
//           window.location.href = '/restaurant-dashboard';
//         }
//       })
//       .catch(error => {
//         console.error('Error logging in:', error);
//         if (error.response && error.response.data) {
//           setError(error.response.data.error);
//         } else {
//           setError('An error occurred during login.');
//         }
//       });
//   };

//   return (
//     <div className = 'home-container'>
//       <h2>Login</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {success && <p style={{ color: 'green' }}>{success}</p>}
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="username">Username:</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//       <p><strong>Don't have an account? </strong><Link to="/">Create a new User</Link></p>
//     </div>
//   );
// };

// export default Login;
