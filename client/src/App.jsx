import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
import Stream from "./components/CourseChat/Stream"
import Classwork from './components/Classwork/Classwork';
import IndexPage from './pages/IndexPage/IndexPage';
import People from './components/CoursePeople/People';
import Grades from './components/CourseGrades/Grades'
import "./styles/main.css"
import "./styles/themes.css"
import TestsPage from './pages/TestsPage/TestsPage';
import TestAttemptPage from './pages/TestAttemptPage/TestAttemptPage';
import TestReviewPage from './pages/TestReviewPage/TestReviewPage';

const App = () => {
  const { isDarkMode } = useSelector((state) => state.user);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/guest" element={<GuestPage />} />
          <Route path="/auth-register" element={<RegisterPage />} />
          <Route path="/auth-login" element={<LoginPage />} />
          <Route path="/home" element={<Layout><HomePage /></Layout>} />
          <Route path="/course/:courseId/stream/:chatId" element={<Layout><CoursePage><Stream /></CoursePage></Layout>} />
          <Route path="/course/:courseId/classwork" element={<Layout><CoursePage><Classwork /></CoursePage></Layout>} />
          <Route path="/course/:courseId/student" element={<Layout><CoursePage><People /></CoursePage></Layout>} />
          <Route path="/course/:courseId/grades" element={<Layout><CoursePage><Grades /></CoursePage></Layout>} />
          <Route path="/assignments" element={<Layout><AssignmentsPage /></Layout>} />
          <Route path="/assignment/:assignmentId" element={<Layout><AssignmentView /></Layout>} />
          <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />

          <Route path="/messages" element={<Layout><MessagesPage /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          <Route path="/tests" element={<Layout><TestsPage /></Layout>} />
          <Route path="/test/update/:test_id" element={<Layout><TestCreationForm /></Layout>} />
          <Route path="/tests/create" element={<Layout><TestCreationForm /></Layout>} />
          <Route path="/test/attempt/:assignmentID" element={<Layout><TestAttemptPage /></Layout>} />
          <Route path="/test/review/:assignmentID/:studentId" element={<Layout><TestReviewPage /></Layout>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;