import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RegisterPage } from './components/AuthPages/RegisterPage';
import { LoginPage } from './components/AuthPages/LoginPage';
import GuestPage from './components/GuestPage/GuestPage';
import HomePage from './components/HomePage/HomePage'
import CoursePage from './components/CoursePage/CoursePage'
import './styles/main.css';
import Layout from './components/Layout/Layout';
import ProfilePage from './components/ProfilePage/ProfilePage';
import SettingsPage from './components/SettingsPage/SettingsPage';
import TestCreationForm from './components/TestCreationForm/TestCreationForm';

const App = () => {
  const [user_id, setID] = useState("");
  const [role, setRole] = useState(''); 
    useEffect(() => {
      const authToken = localStorage.getItem('authToken');
  
      if (authToken) {
        try {
          const decodedTokenData = jwtDecode(authToken); 
  
          setID(decodedTokenData.id || ''); 
          setRole(decodedTokenData.role || '');
        } catch (error) {
          console.error('Error decoding authToken:', error);
        }
      }
    }, []);
  

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<GuestPage />} />
          <Route path="/auth-register" element={<RegisterPage />} />
          <Route path="/auth-login" element={<LoginPage />} />
          <Route path="/Home" element={<Layout><HomePage user_id={user_id} user_role={role}/></Layout>} />
          <Route path="/course/:courseId" element={<Layout><CoursePage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          <Route path="/test" element={<TestCreationForm/>} />
        </Routes>
       
      </div>
    </Router>
  );
};

export default App;
