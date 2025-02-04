import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RegisterPage } from './pages/AuthPages/RegisterPage';
import { LoginPage } from './pages/AuthPages/LoginPage';
import GuestPage from './pages/GuestPage/GuestPage';
import HomePage from './pages/HomePage/HomePage'
import CoursePage from './pages/CoursePage/CoursePage'
import './styles/main.css';
import Layout from './components/Layout/Layout';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import TestCreationForm from './pages/CreationFormPage/TestCreationForm';
import AssignmentsPage from './pages/AssigmentsPage/AssigmentsPage';
import AssignmentView from './components/AssignmentView/AssignmentView';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import MessagesPage from "./pages/MassagePage/MassagePage"
import Stream from "./pages/CoursePage/CourseContent/Stream"
import Classwork from './pages/CoursePage/CourseContent/Classwork';
import IndexPage from './pages/IndexPage/IndexPage'
import People from './pages/CoursePage/CourseContent/People';
import Grades from './pages/CoursePage/CourseContent/Grades';
import io from 'socket.io-client'
import makeToast from './Toaster/Toaster'

const App = () => {

  const [user_id, setID] = useState("");
  const [role, setRole] = useState(''); 
  const [name, setName] = useState("")
  const [socket, setSocket] = useState(null);

  const setupToken = () => {
        const authToken = localStorage.getItem('authToken');
        console.log("🔌 Connecting WebSocket...");

        const newSocket = io("http://localhost:5000", {
          query: { token: authToken },
          transports: ["websocket", "polling"],
          reconnection: true,          
          reconnectionAttempts: 2,   
          reconnectionDelay: 2000      
        });
    
        newSocket.on("connect", () => makeToast("success", "Socket Connected"));
    
        newSocket.on("disconnect", (reason) => {
          makeToast("error", `Socket Disconnected: ${reason}`);
          console.warn("🔴 Disconnected from server:", reason);
          setSocket(null);
        });
    
        newSocket.on("connect_error", (err) => {
          console.error("⚠️ WebSocket connection error:", err);
        });
    
        setSocket(newSocket);
  }

  useEffect(() => {
      const authToken = localStorage.getItem('authToken');
  
      if (authToken) {
        try {
          const decodedTokenData = jwtDecode(authToken); 
  
          setID(decodedTokenData.id || ''); 
          setRole(decodedTokenData.role || '');
          setName(decodedTokenData.name)
        } catch (error) {
          console.error('Error decoding authToken:', error);
        }
      }

      if (!socket) {
        setupToken();
      }
    
      return () => {
        if (socket) {
          console.log("🛑 Closing WebSocket...");
          socket.disconnect();
          setSocket(null);
        }
      };
    }, []);
  

  return (
    <Router>
      <div className="app">
      <Routes>
        
          <Route path="/" element={<IndexPage />} />
          <Route path="/guest" element={<GuestPage />} />
          <Route path="/auth-register" element={<RegisterPage />} />
          <Route path="/auth-login" element={<LoginPage />} />
          <Route path="/home" element={<Layout><HomePage user_id={user_id} user_role={role}/></Layout>} />
          <Route path="/course/:courseId/stream" element={<Layout><CoursePage><Stream socket={socket} setupToken={setupToken} user_id={user_id}/></CoursePage></Layout>} />
          <Route path="/course/:courseId/classwork" element={<Layout><CoursePage><Classwork username={name}/></CoursePage></Layout>} />
          <Route path="/course/:courseId/student" element={<Layout><CoursePage><People/></CoursePage></Layout>} />
          <Route path="/course/:courseId/grades" element={<Layout><CoursePage><Grades/></CoursePage></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          <Route path="/test" element={<TestCreationForm/>} />
          <Route path="/assignments" element={<Layout><AssignmentsPage /></Layout>} />
          <Route path="/assignment/:assignmentId" element={<Layout><AssignmentView /></Layout>} />
          <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
          <Route path="/messages" element={<Layout><MessagesPage /></Layout>} />
        </Routes>
       
      </div>
    </Router>
  );
};

export default App;
