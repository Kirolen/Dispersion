import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { LoginPage, RegisterPage } from './components/AuthPages/AuthPages';
import GuestPage from './components/GuesrPage/GuestPage';
import './styles/main.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<GuestPage/>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
