import { useState } from 'react';
import { setStaffSession } from './Slices/DashboardSlice';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const AuthCreds = () => {
  const [staffName, setStaffName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); 

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
  e.preventDefault();
  const newEntry = { staffName, email, password };

  try {
    const res = await fetch(`http://localhost:3001/dashboard/auth/${staffName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Login failed');
      return;
    }

    const token = data.token;
    if (!token || typeof token !== 'string') {
      console.error('Invalid token received');
      return;
    }

    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    dispatch(setStaffSession(decoded));
    alert('Login successful!');

    setStaffName('');
    setEmail('');
    setPassword('');  

    navigate('/dashboard');

  } catch (error) {
    console.error('Network error:', error);
  }
};


  return (
    <div className="auth-container">
      <h2 className="auth-title">Welcome to the OnePiece Dashboard!</h2>
      <p className="auth-subtitle">Login to view Seller Dashboard</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label className="form-label">Staff Name</label>
          <input
            type="text"
            className="form-input"
            value={staffName}
            required
            placeholder="Enter your name"
            onChange={(e) => setStaffName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            required
            placeholder="Enter your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            required
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" className="submit-button">Login</button>
        </div>
      </form>
    </div>
  );
};

export default AuthCreds;
