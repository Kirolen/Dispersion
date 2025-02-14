import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Aside from '../Aisde/Aside'
import './Layout.css'
import { useSocket } from '../../context/SocketContext'

const Layout = ({ children }) => {
  const {isCollapsed} = useSocket

  return (
    <div className="layout">
      <Header />
      <div className={`layout-container`}>
        <Aside /> 
        <main className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
        {children} 
      </main>
      </div>
     
     
      <Footer />
    </div>
  );
};

export default Layout;
