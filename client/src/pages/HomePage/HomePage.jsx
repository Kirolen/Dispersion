import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse, joinCourse, getMyCourses } from '../../api/courseService';
import { useSelector } from 'react-redux';
import './HomePage.css'

const HomePage = () => {
  const navigate = useNavigate();
  const [modalState, setModalState] = useState({
    showModal: false,
    courseAction: '', 
    courseName: '',
    courseDesc: '',
    courseCode: ''
  });
  const [courses, setCourses] = useState([]);
  const { user_id, role, notification } = useSelector((state) => state.user);

  useEffect(() => {
    handleMyCourse();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleModalOpen = (action) => {
    setModalState((prevState) => ({
      ...prevState,
      showModal: true,
      courseAction: action,
      courseName: '',
      courseDesc: '',
      courseCode: ''
    }));
  };

  const handleModalClose = () => {
    setModalState((prevState) => ({
      ...prevState,
      showModal: false
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (modalState.courseAction === 'create') await createCourse(modalState.courseName, modalState.courseDesc, user_id);
      else if (modalState.courseAction === 'join') await joinCourse(user_id, modalState.courseCode);
      handleMyCourse();
      handleModalClose();
    } catch (error) {
      console.log(modalState.courseAction === 'create' ? 'Failed to create course.' : 'Failed to join course.');
    }
  };

  const handleMyCourse = async () => {
    try {
      const result = await getMyCourses();
      setCourses([...result]);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  return (
    <div className="home-container">
      <div className="dashboard-header">
        <h1>Welcome to Dispersion</h1>
        <div className="action-buttons">
          {role === 'Teacher' ? (
            <button className="create-button" onClick={() => handleModalOpen('create')}>
              Create Course
            </button>
          ) : (
            <button className="join-button" onClick={() => handleModalOpen('join')}>
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
            onClick={() => navigate(`/course/${course.course_id}/stream/${course.chatId}`)}
          >
            <div className="course-card-content">
              <h3>{course.course_name}
                {notification?.unreadCourses?.includes(course.chatId) && (
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

      {modalState.showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalState.courseAction === 'create' ? 'Create New Course' : 'Join Course'}</h2>
            {modalState.courseAction === 'create' ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                  type="text"
                  name="courseName"
                  placeholder="Course Name"
                  value={modalState.courseName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="courseDesc"
                  placeholder="Short description"
                  value={modalState.courseDesc}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              <input
                type="text"
                name="courseCode"
                placeholder="Enter Course Code"
                value={modalState.courseCode}
                onChange={handleInputChange}
              />
            )}
            <div className="modal-buttons">
              <button className="submit-button" onClick={handleSubmit}>
                {modalState.courseAction === 'create' ? 'Create' : 'Join'}
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
