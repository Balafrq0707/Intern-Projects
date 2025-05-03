import React, { useState } from 'react';
import '../App.css';


const AuthForm = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clickEvent, setClickEvent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEntry = { userName, email, password };

    try {
      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });

      if (res.ok) {
        console.log('Data submitted successfully!', newEntry);
        setUserName('');
        setEmail('');
        setPassword('');
      } else {
        const errorData = await res.json();
        console.error('Server responded with an error:', errorData.message);
      }
    } catch (error) {
      console.error('Network or server error:', error);
    }
  };

  const handleAccess = async (e) => {
    e.preventDefault();
    const newEntry = { userName, email, password };

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });

      if (res.ok) {
        console.log(`Login Successful! Hello ${userName}`);
        setUserName('');
        setEmail('');
        setPassword('');
      } else {
        const errorData = await res.json();
        console.error('Server responded with an error:', errorData.message);
      }
    } catch (error) {
      console.error('Network or server error:', error);
    }
  };

  return (
    <div>
      <button className="register-toggle-btn" onClick={() => setClickEvent('Register')}>
        Register
      </button>

      <button className="login-toggle-btn" onClick={() => setClickEvent('Login')}>
        Login
      </button>

      {clickEvent && (
        <div className="form-container">
          <h2>{clickEvent}</h2>
          <form onSubmit={clickEvent === 'Register' ? handleSubmit : handleAccess}>
            <div className="input-group">
              <label htmlFor="userName">User Name</label>
              <input
                type="text"
                value={userName}
                required
                placeholder="Enter your name"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                value={email}
                required
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                value={password}
                required
                placeholder="Enter your Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit">{clickEvent}</button>

            {clickEvent === 'Login' ? (
              <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Don’t have an account?{' '}
                <span
                  style={{
                    color: '#007bff',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                  onClick={() => setClickEvent('Register')}
                >
                  SignUp here
                </span>
              </p>
            ) : (
              <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Already a member?{' '}
                <span
                  style={{
                    color: '#007bff',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                  onClick={() => setClickEvent('Login')}
                >
                  Login here
                </span>
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
