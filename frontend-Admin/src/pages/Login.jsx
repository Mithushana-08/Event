import React, { useState } from 'react';
import './login.css';
import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Login failed:', data);
        throw new Error(data.message || 'Invalid credentials');
      }
      localStorage.setItem('token', data.token);
      // Redirect to AdminDashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <FaLock className="login-lock-icon large" />
        <h2 className="login-title">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <FaUser className="login-input-icon left" />
            <input
              className="login-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-input-group">
            <FaLock className="login-input-icon left" />
            <input
              className="login-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span className="login-eye-icon" onClick={() => setShowPassword(v => !v)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;