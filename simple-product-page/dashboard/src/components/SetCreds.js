import React, { useState } from 'react';


const ADMIN_PASSKEY = process.env.REACT_APP_ADMIN_PASSKEY;

const SetCreds = () => {
  const [staffName, setStaffName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === 'admin' && passkey !== ADMIN_PASSKEY) {
      setError('Invalid admin passkey');
      return;
    }

    setError('');
    const staffData = {
      staffname: staffName,
      email,
      password,
      role
    };

    try {
      const response = await fetch('http://localhost:3001/dashboard/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      alert('Staff registered successfully!');
      setStaffName('');
      setEmail('');
      setPassword('');
      setRole('');
      setPasskey('');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-heading">Staff Registration Form</h2>
      {error && <p className="register-error">{error}</p>}

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Staff Name</label>
          <input
            type='text'
            value={staffName}
            placeholder='Enter the staff name'
            required
            onChange={(e) => setStaffName(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type='email'
            value={email}
            placeholder='Enter the business email ID'
            required
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type='password'
            value={password}
            placeholder='Enter the password'
            required
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group role-selection">
          <label className="form-label">Role</label>
          <label>
            <input
              type='radio'
              name='role'
              value='staff'
              checked={role === 'staff'}
              onChange={(e) => setRole(e.target.value)}
            />
            Staff
          </label>
          <label>
            <input
              type='radio'
              name='role'
              value='admin'
              checked={role === 'admin'}
              onChange={(e) => setRole(e.target.value)}
            />
            Admin
          </label>
        </div>

        {role === 'admin' && (
          <div className="form-group">
            <label className="form-label">Admin Passkey</label>
            <input
              type='password'
              value={passkey}
              placeholder='Enter admin passkey'
              required
              onChange={(e) => setPasskey(e.target.value)}
              className="form-input"
            />
          </div>
        )}

        <div className="form-group">
          <button type='submit' className="form-button">Register</button>
        </div>
      </form>
    </div>
  );
};

export default SetCreds;
