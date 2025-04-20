import React, { useState } from 'react';
import styles from './SettingsPage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { togglePushNotifications, toggleTheme } from '../../store/reducers/userSlice';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { isDarkMode, isPushEnabled } = useSelector(state => state.user)

  const [settings, setSettings] = useState({

    language: 'en'
  });

  const handleChange = (e) => {
    setSettings(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h1>Settings</h1>
      </div>

      <div className={styles.settingsContent}>
        <section className={styles.settingsSection}>
          <h2>Notifications</h2>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h3>Push Notifications</h3>
              <p>Receive notifications about course updates</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={isPushEnabled}
                onChange={() => dispatch(togglePushNotifications())}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </section>

        <section className={styles.settingsSection}>
          <h2>Appearance</h2>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h3>Dark Mode</h3>
              <p>Toggle dark mode theme</p>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => dispatch(toggleTheme())}
              />
             <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </section>

        <section className={styles.settingsSection}>
          <h2>Preferences</h2>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h3>Language</h3>
              <p>Choose your preferred language</p>
            </div>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className={styles.settingsSelect}
            >
              <option value="en">English</option>
              <option value="uk">Ukrainian</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;