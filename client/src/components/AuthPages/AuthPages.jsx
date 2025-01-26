import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPages.css'; 
import api from '../../utils/api';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault(); 
    setError(''); 
    setSuccessMessage(''); 

    try {
      const response = await api.post('/auth/login', {email: formData.email, password: formData.password}); 
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      navigate('/home');
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
          <form className="auth-form" onSubmit={handleRegister}>
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
          {successMessage && <p className="success-message">{successMessage}</p>}
          <p className="form-footer">
            Don't have an account? <a href="/auth-register" className="form-link">Register here</a>.
          </p>
        </div>
        <a href="/" className="go-back-buttton">Return to main page</a>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'Student',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault(); 
    setError(''); 
    setSuccessMessage(''); 

    try {
      const response = await api.post('/auth/registration', {first_name: formData.first_name, last_name: formData.last_name, email: formData.email, password: formData.password, role: formData.role}); // Виклик API
      navigate('/auth-login');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration.'); 
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-page">
        <h2 className="page-title">Dispersion</h2>
        <h1 className="welcome-message">Create Your Account</h1>
        <p className="intro-text">
          Join Dispersion to access free educational resources and start learning today!
        </p>

        <div className="form-container">
          <h2 className="form-title">Register</h2>
          <form className="auth-form" onSubmit={handleRegister}>
            <input
              type="text"
              className="form-input"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              className="form-input"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
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
            <div className="form-input">
              <label htmlFor="role" className="role-label">Select Role:</label>
              <select
                id="role"
                name="role"
                className="role-select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>
            <button className="auth-button" type="submit">Register</button>
          </form>
          {error && <p className="error-message">{error}</p>} 
          {successMessage && <p className="success-message">{successMessage}</p>}
          <p className="form-footer">
            Already have an account? <a href="/auth-login" className="form-link">Login here</a>.
          </p>
        </div>
        <a href="/" className="go-back-buttton">Return to main page</a>
      </div>
    </div>
  );
};

export default { LoginPage, RegisterPage };

