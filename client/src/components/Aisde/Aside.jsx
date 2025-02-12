import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import "./Aside.css";
import { getUnreadChats } from '../../api/personalChatService';

import makeToast from '../../Toaster/Toaster';

const Aside = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { socket, user_id, courseNotification, setCourseNotification } = useSocket();

  useEffect(() => {
    if (socket && user_id) {
      const handleNewGlobalNotification = async (data) => {
        console.log("NOTIFIICATION")
        await new Promise(resolve => setTimeout(resolve, 1000));
        const notification = await getUnreadChats();
        console.log(notification.data.unreadCourses)
        setCourseNotification(notification.data.unreadCourses);
        if (notification.data.unreadCourses.length > 0) makeToast("info", `${data.sender}: ${data.message}`);
      };

      socket.on("newGlobalNotification", handleNewGlobalNotification);

      const fetchUnreadMessages = async () => {
        console.log("aside")
        const notification = await getUnreadChats(user_id);
        setCourseNotification(notification.data.unreadCourses);
      };
      fetchUnreadMessages();

      return () => {
        if (socket) {
          socket.off("newGlobalNotification", handleNewGlobalNotification);
        }
      };
    }
  }, [socket, user_id]);  

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
            {link.label === "Dashboard" && courseNotification.length > 0 && (
              <span>🔴</span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Aside;
