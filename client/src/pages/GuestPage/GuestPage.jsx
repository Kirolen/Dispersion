import React from 'react';
import styles from './GuestPage.module.css'; 
import { useNavigate } from 'react-router-dom';
import logo from '../../img/logo.png';

const GuestPage = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.guestPageContainer}>
      <div className={styles.guestPage}>
        <h2 className={styles.pageTitle}>Dispersion</h2>
        <h1 className={styles.welcomeMessage}>Welcome to white knowledge!</h1>
        <p className={styles.introText}>
          Dispersion is an online platform dedicated to providing free educational resources 
          and making learning accessible to everyone. Start your educational journey today!
        </p>

        <div className={styles.accessPanel}>
          <div className={styles.authSection}>
            <div className={styles.registration}>
              <h1 className={styles.registrationTitle} onClick={() => navigate('/auth-register')}>Registration</h1>
              <h3>The first step to education</h3>
              <p>To gain access to the platform, you need to create an account. It's quick and easy. 
                Once you're registered, you'll be able to access all educational materials!</p>
            </div>
            <div className={styles.login}>
              <h2>Already a member?</h2>
              <button className={styles.loginButton} onClick={() => navigate('/auth-login')}>Login to your account</button>
              <p>If you've already used Dispersion, login to access your personal dashboard and resources.</p>
            </div>
          </div>
          
          <div className={styles.aboutUsSection}>
            <img className={styles.aboutUsImage} src={logo} alt="About us" />
            <h2 className={styles.aboutUsTitle}>Free Education</h2>
            <p className={styles.aboutUsDescription}>
              Dispersion offers a variety of educational materials for free. Whether you want to learn something new 
              or brush up on existing skills, we provide a range of resources to support your learning journey.
            </p>
            <button className={styles.aboutUsButton}>Learn More</button>
          </div>
        </div>

        <div className={styles.contactInfo}>
          <p>Follow us on Telegram</p>
          <p>Connect with us on TikTok</p>
        </div>
      </div>
    </div>
  );
};

export default GuestPage;
