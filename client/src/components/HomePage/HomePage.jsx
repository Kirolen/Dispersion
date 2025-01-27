import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import api from '../../utils/api'; 

const HomePage = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [courseAction, setCourseAction] = useState(''); 
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [user_id, setID] = useState("");
  const [role, setRole] = useState(''); 
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      try {
        const decodedTokenData = jwtDecode(authToken); 

        setID(decodedTokenData.id || ''); 
        setRole(decodedTokenData.role || '');
        handleMyCourse() 
      } catch (error) {
        console.error('Error decoding authToken:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleCreateCourse = async () => {
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
    if (courseAction === 'create') {
      try {
        const response = await api.post('/create-courses', {course_name: courseName, teacher_id: user_id} ); 
        alert('Course created!');
      } catch (error) {
        console.error('Error creating course:', error);
        alert('Failed to create course.');
      }
    } else if (courseAction === 'join') {
      try {
        const response = await api.post('/join-course', {user_id, course_id: courseCode} ); 
        alert('Successfully joined the course!');
      } catch (error) {
        console.error('Error joining course:', error);
        alert('Failed to join course.');
      }
    }

    handleModalClose();
  };

  const handleMyCourse = async () =>{
    try {
      const response = await api.get('/get-my-courses');
      setCourses(response.data.data)
    } catch (error) {
      alert('Failed to find course.');
    }
  }

  return (
    <div>
      <h1>My Home</h1>
      {role === 'Teacher' && (
        <button onClick={handleCreateCourse}>Create Course</button>
      )}

      {role === 'Student' && (
        <button onClick={handleJoinCourse}>Join Course</button>
      )}

      <button onClick={handleLogout}>Вийти</button>

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
      
      <button onClick={handleMyCourse}>My Course</button>
      <div>
        <h2>My Courses</h2>
        {courses.length > 0 ? (
          <ul>
            {courses.map((course) => (
              <li key={course._id}
              onClick={() => navigate(`/course/${course._id}`)}>
                {course.course_name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No courses found.</p>
        )}
      </div>
    </div>

  );
};

export default HomePage;
