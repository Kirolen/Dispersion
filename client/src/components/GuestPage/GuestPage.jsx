import React from 'react';
import './GuestPage.css'; 
import { useNavigate } from 'react-router-dom';
import logo from '../../img/logo.png';

const GuestPage = () => {
  const navigate = useNavigate();
  return (
    <div className="guest-page-container">
      <div className="guest-page">
        <h2 className="page-title">Dispersion</h2>
        <h1 className="welcome-message">Welcome to white knowledge!</h1>
        <p className="intro-text">
          Dispersion is an online platform dedicated to providing free educational resources 
          and making learning accessible to everyone. Start your educational journey today!
        </p>

        <div className="access-panel">
          <div className="registration-section">
            <div className="registration">
              <h1 className="section-title" onClick={() => navigate('/auth-register')}>Registration</h1>
              <h3>The first step to education</h3>
              <p>To gain access to the platform, you need to create an account. It's quick and easy. 
                Once you're registered, you'll be able to access all educational materials!</p>
            </div>
            <div className="login">
              <h2 className='section-title'>Already a member?</h2>
              <button className="login-button" onClick={() => navigate('/auth-login')}>Login to your account</button>
              <p>If you've already used Dispersion, login to access your personal dashboard and resources.</p>
            </div>
          </div>
          
          <div className="about-us-section">
            <img className="about-us-image" src={logo} alt="About us" />
            <h2 className="about-us-title">Free Education</h2>
            <p className="about-us-description">
              Dispersion offers a variety of educational materials for free. Whether you want to learn something new 
              or brush up on existing skills, we provide a range of resources to support your learning journey.
            </p>
            <button className="about-us-button">Learn More</button>
          </div>
        </div>

        <div className="contact-info">
          <p className="contact-info-text">Follow us on Telegram</p>
          <p className="contact-info-text">Connect with us on TikTok</p>
        </div>
      </div>
    </div>
  );
};

export default GuestPage;
