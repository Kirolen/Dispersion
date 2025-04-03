import React from 'react';
import styles from './Header.module.css';
import { AiOutlineMenu } from "react-icons/ai";
import { useSocket } from '../../context/SocketContext';


const Header = () => {
  const {isMenuOpen, setIsMenuOpen } = useSocket();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Dispersion</h1>
      <p className={styles.subtitle}>Welcome to white knowledge</p>
      <AiOutlineMenu className={`${styles.menuButton} ${isMenuOpen ? styles.open : ''}`} onClick={toggleMenu} />
    </header>
  );
};

export default Header;
