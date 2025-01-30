import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Aside from '../Aisde/Aside'
import './Layout.css'

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div className='layout-container'>
        <Aside /> 
        <main className="main-content">
        {children} 
      </main>
      </div>
     
     
      <Footer />
    </div>
  );
};

export default Layout;
