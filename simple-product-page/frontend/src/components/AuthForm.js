import React, { useState, useEffect } from 'react';
import '../App.css';
import { useCart } from './Cart/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { setSession } from './slices/Slice';

const AuthForm = ({ type }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState(type || 'Login');
  const { getCartItemCount } = useCart();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/login') setMode('Login');
    else if (location.pathname === '/register') setMode('Register');
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEntry = { username: userName, email, password };
    const endpoint = mode === 'Register' ? 'register' : 'login';

    try {
      const res = await fetch (`http://localhost:3001/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });

      const data = await res.json();
      console.log("API response:", data);

      if (res.ok) {
        const token = data.token;
        localStorage.setItem('token', token);

        const decoded = jwtDecode(token);
        dispatch(setSession(decoded));   
        if (mode === 'Login') {
          console.log(`Login Successful! Hello ${decoded.username}`);
          if (getCartItemCount() === 0) {
            navigate('/');
          } else {
            navigate('/cart/summary');
          }
        } else {
          console.log('Registration successful!');
          setUserName('');
          setEmail('');
          setPassword('');
          navigate('/login');
        }
      } else {
        console.error('Server error:', data.message);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div>
      <div className="toggle-buttons">
        <button
          className="register-toggle-btn"
          onClick={() => setMode('Register')}
          disabled={mode === 'Register'}
        >
          Register
        </button>
        <button
          className="login-toggle-btn"
          onClick={() => setMode('Login')}
          disabled={mode === 'Login'}
        >
          Login
        </button>
      </div>

      <div className="form-container">
        <h2>{mode}</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>User Name</label>
            <input
              type="text"
              value={userName}
              required
              placeholder="Enter your name"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              required
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              required
              placeholder="Enter your Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">{mode}</button>

          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            {mode === 'Login' ? (
              <>
                Don’t have an account?{' '}
                <span
                  onClick={() => setMode('Register')}
                  style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign up here
                </span>
              </>
            ) : (
              <>
                Already a member?{' '}
                <span
                  onClick={() => setMode('Login')}
                  style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Login here
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
