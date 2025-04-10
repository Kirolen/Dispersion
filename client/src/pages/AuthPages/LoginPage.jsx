import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPages.module.css';
import { login } from '../../api/authService'
import { useSocket } from '../../context/SocketContext';

export const LoginPage = () => {
  const { setupSocket } = useSocket();
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
      const token = await login(formData.email, formData.password);
      localStorage.setItem('authToken', token);
      navigate('/home');
      setupSocket();
    } catch (err) {
      setError(err.message || 'An error occurred during login.');
    }
  };

  return (
    <div className={styles.authPageContainer}>
      <div className={styles.authPage}>
        <h2 className={styles.pageTitle}>Dispersion</h2>
        <h1 className={styles.welcomeMessage}>Welcome Back!</h1>
        <p className={styles.introText}>
          Log in to your account to access your personalized dashboard and all the educational resources.
        </p>

        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Login</h2>
          <form className={styles.authForm} onSubmit={handleLogin}>
            <input
              type="email"
              className={styles.formInput}
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              className={styles.formInput}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button className={styles.authButton}>Login</button>
          </form>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <p className={styles.formfooter}>
            Don't have an account? <a href="/auth-register" className={styles.formLink}>Register here</a>.
          </p>
          <a href="/" className={styles.returnButton}>Return to main page</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;