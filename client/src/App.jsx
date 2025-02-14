// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SocketProvider, useSocket } from "./context/SocketContext";

import Layout from './components/Layout/Layout';

import { RegisterPage } from './pages/AuthPages/RegisterPage';
import { LoginPage } from './pages/AuthPages/LoginPage';
import GuestPage from './pages/GuestPage/GuestPage';
import HomePage from './pages/HomePage/HomePage';
import CoursePage from './pages/CoursePage/CoursePage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import TestCreationForm from './pages/CreationFormPage/TestCreationForm';
import AssignmentsPage from './pages/AssigmentsPage/AssigmentsPage';
import AssignmentView from './components/AssignmentView/AssignmentView';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import MessagesPage from "./pages/MassagePage/MassagePage";
import Stream from "./pages/CoursePage/CourseContent/Stream";
import Classwork from './pages/CoursePage/CourseContent/Classwork';
import IndexPage from './pages/IndexPage/IndexPage';
import People from './pages/CoursePage/CourseContent/People';
import Grades from './pages/CoursePage/CourseContent/Grades';
import "./styles/main.css"

const App = () => {
  const { user_id, role } = useSocket(); 

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/guest" element={<GuestPage />} />
          <Route path="/auth-register" element={<RegisterPage />} />
          <Route path="/auth-login" element={<LoginPage />} />
          <Route path="/home" element={<Layout><HomePage user_id={user_id} user_role={role} /></Layout>} />
          <Route path="/course/:courseId/stream/:chatId" element={<Layout><CoursePage><Stream /></CoursePage></Layout>} />
          <Route path="/course/:courseId/classwork" element={<Layout><CoursePage><Classwork user_id={user_id} role={role} /></CoursePage></Layout>} />
          <Route path="/course/:courseId/student" element={<Layout><CoursePage><People /></CoursePage></Layout>} />
          <Route path="/course/:courseId/grades" element={<Layout><CoursePage><Grades user_id={user_id} role={role} /></CoursePage></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          <Route path="/test" element={<TestCreationForm />} />
          <Route path="/assignments" element={<Layout><AssignmentsPage user_id={user_id} role={role} /></Layout>} />
          <Route path="/assignment/:assignmentId" element={<Layout><AssignmentView user_id={user_id} role={role} /></Layout>} />
          <Route path="/calendar" element={<Layout><CalendarPage user_id={user_id} /></Layout>} />
          <Route path="/messages" element={<Layout><MessagesPage /></Layout>} />
        </Routes>
      </div>
    </Router>
  );
};

const AppWithSocket = () => {
  return (
    <SocketProvider>
      <App />
    </SocketProvider>
  );
};

export default AppWithSocket;
