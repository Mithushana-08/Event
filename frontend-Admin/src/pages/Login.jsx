import React, { useState } from 'react';
import './login.css';
import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <div className="login-box">
        <FaLock className="login-lock-icon large" />
        <h2 className="login-title">Admin Login</h2>
        <div className="login-input-group">
          <FaUser className="login-input-icon left" />
          <input className="login-input" type="text" placeholder="Username" />
        </div>
        <div className="login-input-group">
          <FaLock className="login-input-icon left" />
          <input
            className="login-input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
          />
          <span className="login-eye-icon" onClick={() => setShowPassword(v => !v)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="login-forgot">
          <a href="#" className="forgot-link">Forgot password?</a>
        </div>
        <button className="login-button">Login</button>
      </div>
    </div>
  );
};

export default LoginPage;