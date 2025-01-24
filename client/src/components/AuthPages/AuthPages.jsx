import React from 'react';
import './AuthPages.css'; 

export const LoginPage = () => {
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
          <form className="auth-form">
            <input type="email" className="form-input" placeholder="Email" required />
            <input type="password" className="form-input" placeholder="Password" required />
            <button className="auth-button">Login</button>
          </form>
          <p className="form-footer">
            Don't have an account? <a href="/register" className="form-link">Register here</a>.
          </p>
        </div>
        <a href="/" className="go-back-buttton">Return to main page</a>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
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
          <form className="auth-form">
            <input type="text" className="form-input" placeholder="Full Name" required />
            <input type="email" className="form-input" placeholder="Email" required />
            <input type="password" className="form-input" placeholder="Password" required />
            <button className="auth-button">Register</button>
          </form>
          <p className="form-footer">
            Already have an account? <a href="/login" className="form-link">Login here</a>.
          </p>
        </div>
        <a href="/" className="go-back-buttton">Return to main page</a>
      </div>
    </div>
  );
};

export default { LoginPage, RegisterPage };
