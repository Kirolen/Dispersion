import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./Aside.css";

const Aside = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const links = [
    { href: "/home", label: "Dashboard", icon: "📊" },
    { href: "/my-courses", label: "My Courses", icon: "📚" },
    { href: "/assignments", label: "Assignments", icon: "✍️" },
    { href: "/calendar", label: "Calendar", icon: "📅" },
    { href: "/messages", label: "Messages", icon: "💬" },
    { href: "/profile", label: "Profile", icon: "👤" },
    { href: "/settings", label: "Settings", icon: "⚙️" }
  ];

  return (
    <aside className={`aside-bar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="toggle-button"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? '→' : '←'}
      </button>
      <div className="aside-header">
        <h2>Navigation</h2>
      </div>
      <nav className="aside-nav">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.href}
            className={`nav-link ${location.pathname === link.href ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            <span className="nav-label">{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Aside;