import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse, joinCourse, getMyCourses } from '../../api/courseService';
import './HomePage.css';
import { mockCourses } from "../../mockData/mockData"
import { useSocket } from '../../context/SocketContext';

const HomePage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [courseAction, setCourseAction] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courses, setCourses] = useState([]);
  const { user_id, role, courseNotification} = useSocket()

  useEffect(() => {
    const res = handleMyCourse();
    console.log(res)
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleCreateCourse = () => {
    setCourseAction('create');
    setShowModal(true);
  };

  const handleJoinCourse = () => {
    setCourseAction('join');
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCourseName('');
    setCourseCode('');
  };

  const handleSubmit = async () => {
    try {
      if (courseAction === 'create') {
        await createCourse(courseName, courseDesc, user_id);
        alert('Course created successfully!');
      } else if (courseAction === 'join') {
        await joinCourse(user_id, courseCode);
        alert('Successfully joined the course!');
      }
      handleMyCourse();
      handleModalClose();
    } catch (error) {
      alert(courseAction === 'create' ? 'Failed to create course.' : 'Failed to join course.');
    }
  };

  const handleMyCourse = async () => {
    try {
      const result = await getMyCourses();
      setCourses([...result, ...mockCourses()]);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  return (
    <div className="home-container">
      <div className="dashboard-header">
        <h1>Welcome to Dispersion</h1>
        <div className="action-buttons" >
          {role === 'Teacher' ? (
            <button className="create-button" onClick={handleCreateCourse}>
              Create Course
            </button>
          ) : (
            <button className="join-button" onClick={handleJoinCourse}>
              Join Course
            </button>
          )}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="courses-grid">
        {courses.map((course) => (
          <div
            key={course.course_id}
            className="course-card"
            onClick={() => navigate(`/course/${course.course_id}/stream`)}
          >
            <div className="course-card-content">
              <h3>{course.course_name}
                {courseNotification.includes(course.course_id) && (
                  <span className="notification-dot">🔴</span>
                )}

              </h3>
              <p>{course.course_desc || 'No description available'}</p>
            </div>
            <div className="course-card-footer">
              <span>Teacher: {course.teacher_name || 'Unknown'}</span>
              <span>{course.students?.length || 0} students</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{courseAction === 'create' ? 'Create New Course' : 'Join Course'}</h2>
            {courseAction === 'create' ?
              <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                  type="text"
                  placeholder="Course Name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Short description"
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                />
              </div>
              : (
                <input
                  type="text"
                  placeholder="Enter Course Code"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                />
              )}
            <div className="modal-buttons">
              <button className="submit-button" onClick={handleSubmit}>
                {courseAction === 'create' ? 'Create' : 'Join'}
              </button>
              <button className="cancel-button" onClick={handleModalClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;