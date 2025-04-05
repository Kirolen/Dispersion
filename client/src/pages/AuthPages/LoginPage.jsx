import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPages.css'; 
import {login} from '../../api/authService'
import { useSocket } from '../../context/SocketContext';

export const LoginPage = () => {
  const {setupSocket} = useSocket();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(''); 

    try {
      const token = await login(formData.email,formData.password);
      localStorage.setItem('authToken', token);
      navigate('/home');
      setupSocket();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login.'); 
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-page">
        <h2 className="page-title">Dispersion</h2>
        <h1 className="welcome-message">Welcome Back!</h1>
        <p className="intro-text">
          Log in to your account to access your personalized dashboard and all the educational resources.
        </p>

        <div className="form-container">
          <h2 className="form-title">Login</h2>
          <form className="auth-form" onSubmit={handleLogin}>
          <input
              type="email"
              className="form-input"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              className="form-input"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button className="auth-button">Login</button>
          </form>
          {error && <p className="error-message">{error}</p>} 
          <p className="form-footer">
            Don't have an account? <a href="/auth-register" className="form-link">Register here</a>.
          </p>
        </div>
        <a href="/" className="go-back-buttton">Return to main page</a>
      </div>
    </div>
  );
};

export default LoginPage;