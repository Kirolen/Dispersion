import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPages.module.css'; 
import { register } from '../../api/authService';


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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await register(formData.first_name, formData.last_name, formData.email, formData.password, formData.role);
      navigate('/auth-login');
    } catch (err) {
      setError(err.message || 'An error occurred during register.');
    }
  };

  return (
    <div className={styles.authPageContainer}>
      <div className={styles.authPage}>
        <h2 className={styles.pageTitle}>Dispersion</h2>
        <h1 className={styles.welcomeMessage}>Create Your Account</h1>
        <p className={styles.introText}>
          Join Dispersion to access free educational resources and start learning today!
        </p>

        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Register</h2>
          <form className={styles.authForm} onSubmit={handleRegister}>
            <input
              type="text"
              className={styles.formInput}
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              className={styles.formInput}
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
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
            <div className={styles.formInput}>
              <label htmlFor="role" className={styles.roleLabel}>Select Role:</label>
              <select
                id="role"
                name="role"
                className={styles.roleSelect}
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>
            <button className={styles.authButton} type="submit">Register</button>
          </form>
          {error && <p className={styles.errorMessage}>{error}</p>}
         <p className={styles.formfooter}>
            Already have an account? <a href="/auth-login"  className={styles.formLink}>Login here</a>.
          </p>
          <a href="/" className={styles.returnButton}>Return to main page</a>
        </div>
        
      </div>
    </div>
  );
};

export default { RegisterPage };

