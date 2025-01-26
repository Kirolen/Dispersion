import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.footerText}>Follow us on:</p>
        <div className={styles.socialLinks}>
          <a href="https://t.me/yourchannel" className={styles.link}>Telegram</a>
          <a href="https://www.tiktok.com/@yourchannel" className={styles.link}>TikTok</a>
        </div>
        <p className={styles.footerText}>© 2025 Dispersion - All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
