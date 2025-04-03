import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import styles from "./Aside.module.css";
import { getUnreadChats } from '../../api/personalChatService';
import makeToast from '../../Toaster/Toaster';

const Aside = () => {
  const location = useLocation();
  const { socket, user_id, notification, setNotification, isMenuOpen } = useSocket();

  useEffect(() => {
    if (socket && user_id) {
      const handleNewGlobalNotification = async (data) => {
        console.log("New Global Notification Received");
  
        try {
          const response = await getUnreadChats(user_id);
          setNotification(response.data);
  
          if (response.data.unreadCourses.length > 0 || response.data.unreadChats.length > 0) {
            makeToast("info", `${data.sender}: ${data.message}`);
          }
        } catch (error) {
          console.error("Error fetching unread notifications:", error);
        }
      };
  
      socket.on("newGlobalNotification", handleNewGlobalNotification);
  
      getUnreadChats(user_id)
        .then(response => setNotification(response.data))
        .catch(error => console.error("Error fetching unread messages:", error));
  
      return () => {
        socket.off("newGlobalNotification", handleNewGlobalNotification);
      };
    }
  }, [socket, user_id, setNotification]);
  

  const links = [
    { href: "/home", label: "Dashboard", icon: "📊" },
    { href: "/assignments", label: "Assignments", icon: "✍️" },
    { href: "/calendar", label: "Calendar", icon: "📅" },
    { href: "/messages", label: "Messages", icon: "💬" },
    { href: "/profile", label: "Profile", icon: "👤" },
    { href: "/settings", label: "Settings", icon: "⚙️" }
  ];

  return (
      <aside className={`${styles['asideBar']} ${isMenuOpen ? '' :  styles['collapsed']}`}>
        <div className={styles.asideHeader}>
          <h2>Navigation</h2>
        </div>
        <nav className={styles.assideNav}>
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className={`${styles['navLink']} ${location.pathname === link.href ? styles['active'] : ''}`}
            >
              <span className={styles.navIcon}>{link.icon}</span>
              <span className={styles.navLabel}>{link.label}</span>
              {(link.label === "Dashboard" && notification?.unreadCourses?.length > 0) ||
                (link.label === "Messages" && notification?.unreadChats?.length > 0) ? (
                <span>🔴</span>
              ) : null}
            </Link>
          ))}
        </nav>
      </aside>
  );
};

export default Aside;
