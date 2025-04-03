import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Aside from '../Aisde/Aside'
import styles from './Layout.module.css'

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.layoutContainer}>
        <Aside />
        <div className={styles.mainContainer}>
          <main className={`main-content`}>
            {children}
          </main>
          <Footer />
        </div>

      </div>
    </div>
  );
};

export default Layout;
