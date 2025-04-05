import React from 'react';
import styles from './Header.module.css';
import { AiOutlineMenu } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu } from '../../store/reducers/menuSlice';

const Header = () => {
  const dispatch = useDispatch();
  const isMenuOpen = useSelector(state => state.menu.isMenuOpen);

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Dispersion</h1>
      <p className={styles.subtitle}>Welcome to white knowledge</p>
      <AiOutlineMenu 
        className={`${styles.menuButton} ${isMenuOpen ? styles.open : ''}`} 
        onClick={() => dispatch(toggleMenu())} 
      />
    </header>
  );
};

export default Header;
