import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import './CoursePage.css';

const CoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stream');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await api.get(`/courses/${courseId}`);
        setCourse(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return <div className="loading">Loading course details...</div>;
  }

  if (!course) {
    return <div className="error">Course not found.</div>;
  }

  return (
    <div className="course-page">
      <div className="course-header">
        <h1>{course.course_name}</h1>
        <p className="course-code">Course Code: {course._id}</p>
      </div>

      <div className="course-tabs">
        <button
          className={`tab ${activeTab === 'stream' ? 'active' : ''}`}
          onClick={() => setActiveTab('stream')}
        >
          Stream
        </button>
        <button
          className={`tab ${activeTab === 'classwork' ? 'active' : ''}`}
          onClick={() => setActiveTab('classwork')}
        >
          Classwork
        </button>
        <button
          className={`tab ${activeTab === 'people' ? 'active' : ''}`}
          onClick={() => setActiveTab('people')}
        >
          People
        </button>
        <button
          className={`tab ${activeTab === 'grades' ? 'active' : ''}`}
          onClick={() => setActiveTab('grades')}
        >
          Grades
        </button>
      </div>

      <div className="course-content">
        {activeTab === 'stream' && (
          <div className="stream-section">
            <div className="announcement-box">
              <input
                type="text"
                placeholder="Share something with your class..."
                className="announcement-input"
              />
              <button className="post-button">Post</button>
            </div>
            <div className="stream-feed">
              {course.announcements?.length > 0 ? (
                course.announcements.map((announcement, index) => (
                  <div key={index} className="announcement-card">
                    <div className="announcement-header">
                      <span className="author">{announcement.author}</span>
                      <span className="date">{announcement.date}</span>
                    </div>
                    <p className="announcement-content">{announcement.content}</p>
                  </div>
                ))
              ) : (
                <div className="no-content">
                  No announcements yet. Be the first to post!
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'classwork' && (
          <div className="classwork-section">
            <div className="add-work">
              <button className="add-work-button">+ Add Assignment</button>
            </div>
            <div className="work-list">
              {course.assignments?.length > 0 ? (
                course.assignments.map((assignment, index) => (
                  <div key={index} className="assignment-card">
                    <h3>{assignment.title}</h3>
                    <p>{assignment.description}</p>
                    <div className="assignment-footer">
                      <span>Due: {assignment.dueDate}</span>
                      <button className="view-button">View Assignment</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-content">No assignments posted yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'people' && (
          <div className="people-section">
            <div className="teachers-list">
              <h2>Teachers</h2>
              <div className="person-card">
                <span className="person-name">{course.teacher_name}</span>
                <span className="person-email">{course.teacher_email}</span>
              </div>
            </div>
            <div className="students-list">
              <h2>Students</h2>
              {course.students?.length > 0 ? (
                course.students.map((student, index) => (
                  <div key={index} className="person-card">
                    <span className="person-name">{student.name}</span>
                    <span className="person-email">{student.email}</span>
                  </div>
                ))
              ) : (
                <div className="no-content">No students enrolled yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="grades-section">
            <div className="grades-header">
              <h2>Grade Book</h2>
              <button className="export-button">Export Grades</button>
            </div>
            {course.grades?.length > 0 ? (
              <table className="grades-table">
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Due Date</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {course.grades.map((grade, index) => (
                    <tr key={index}>
                      <td>{grade.assignment}</td>
                      <td>{grade.dueDate}</td>
                      <td>{grade.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-content">No grades available yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;