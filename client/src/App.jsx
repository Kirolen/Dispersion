import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage } from './components/AuthPages/AuthPages';
import GuestPage from './components/GuesrPage/GuestPage';
import HomePage from './components/HomePage/HomePage'
import CoursePage from './components/CoursePage/CoursePage'
import './styles/main.css';
import Layout from './components/Layout';

const App = () => {
  const isAuthenticated = localStorage.getItem('authToken') !== null;

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<GuestPage />} />
          <Route path="/auth-register" element={<RegisterPage />} />
          <Route path="/auth-login" element={<LoginPage />} />
          <Route path="/Home" element={<Layout><HomePage /></Layout>} />
           <Route path="/course/:courseId" element={<Layout><CoursePage /></Layout>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
