import React, { useState } from 'react';
import './SettingsPage.css';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: true,
    language: 'en',
    timezone: 'UTC+2'
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleChange = (e) => {
    setSettings(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-content">
        <section className="settings-section">
          <h2>Notifications</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Push Notifications</h3>
              <p>Receive notifications about course updates</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={() => handleToggle('notifications')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Email Updates</h3>
              <p>Receive course updates via email</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.emailUpdates}
                onChange={() => handleToggle('emailUpdates')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Dark Mode</h3>
              <p>Toggle dark mode theme</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h2>Preferences</h2>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Language</h3>
              <p>Choose your preferred language</p>
            </div>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="settings-select"
            >
              <option value="en">English</option>
              <option value="uk">Ukrainian</option>
              <option value="pl">Polish</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Timezone</h3>
              <p>Set your local timezone</p>
            </div>
            <select
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              className="settings-select"
            >
              <option value="UTC+0">UTC+0</option>
              <option value="UTC+1">UTC+1</option>
              <option value="UTC+2">UTC+2</option>
              <option value="UTC+3">UTC+3</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;