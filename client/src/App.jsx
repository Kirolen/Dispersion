import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Layout from './components/Layout';
import GuestPage from './components/GuesrPage/GuestPage';
import './styles/main.css';

// Сторінка для авторизованих користувачів
const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard, authorized user!</p>
      <Link to="/">Go to Home Page</Link>
    </div>
  );
};


const App = () => {
  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/">Home</Link>
          {<Link to="/dashboard">Dashboard</Link>}
        </nav>
        <Routes>
          <Route path="/" element={
              <GuestPage/>
          }/>

          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
