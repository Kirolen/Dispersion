import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Dispersion</h1>
      <p className={styles.subtitle}>Welcome to white knowledge</p>
    </header>
  );
};

export default Header;
