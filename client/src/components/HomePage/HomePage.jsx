import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Правильний імпорт

const HomePage = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [courseAction, setCourseAction] = useState(''); // 'create' or 'join'
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courses, setCourses] = useState([]);
  const [role, setRole] = useState(''); // User role (Teacher/Student)

  useEffect(() => {
    // Attempt to get the 'authToken' from localStorage
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      try {
        // Декодуємо JWT
        const decodedTokenData = jwtDecode(authToken); // Використовуємо jwtDecode

        // Перевіряємо наявність курсів та ролі в декодованому токені
        setCourses(decodedTokenData.courses || []);  // Default to an empty array if no courses
        setRole(decodedTokenData.role || '');  // Set the role from the decoded token
      } catch (error) {
        console.error('Error decoding authToken:', error);
      }
    }
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

  const handleSubmit = () => {
    const authToken = localStorage.getItem('authToken');
    let decodedTokenData = null;
    if (authToken) {
      decodedTokenData = jwtDecode(authToken);
    }

    if (courseAction === 'create') {
      const newCourse = { name: courseName, code: courseCode };
      const updatedCourses = [...courses, newCourse];
      
      // Save the updated courses in localStorage
      const updatedToken = JSON.stringify({ ...decodedTokenData, courses: updatedCourses });
      localStorage.setItem('authToken', updatedToken);
      alert('Course Created!');
    } else if (courseAction === 'join') {
      const courseExists = courses.some(course => course.code === courseCode);
      if (courseExists) {
        alert('Successfully joined the course!');
      } else {
        alert('Invalid course code');
      }
    }
    handleModalClose();
  };

  return (
    <div>
      <h1>My Home</h1>
      
      {/* Display courses if the array is not empty */}
      {courses.length > 0 ? (
        <div className="courses-panel">
          <h2>Your Courses</h2>
          <div className="courses-list">
            {courses.map((course, index) => (
              <div key={index} className="course-card">
                <h3>{course.name}</h3>
                {/* You can add more course details here */}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>You don't have any courses yet.</p>
      )}
      
      {/* Display Create Course button for Teachers */}
      {role === 'Teacher' && (
        <button onClick={handleCreateCourse}>Create Course</button>
      )}

      {/* Display Join Course button for Students */}
      {role === 'Student' && (
        <button onClick={handleJoinCourse}>Join Course</button>
      )}

      {/* Logout Button */}
      <button onClick={handleLogout}>Вийти</button>

      {/* Modal for Create/Join Course */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{courseAction === 'create' ? 'Create Course' : 'Join Course'}</h2>

            {courseAction === 'create' ? (
              <>
                <input
                  type="text"
                  placeholder="Course Name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Course Code"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                />
              </>
            ) : (
              <input
                type="text"
                placeholder="Enter Course Code"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              />
            )}

            <button onClick={handleSubmit}>Submit</button>
            <button onClick={handleModalClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
