import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseInfo } from '../../api//courseService'

const CoursePage = ({ children }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [chatId, setchatId] = useState(null);
  const [courseName, setCourseName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stream');
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await getCourseInfo(courseId);
        console.log(res)
        setCourseName(res)
        setchatId(res.chatId)
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

  if (!courseName) {
    return <div className="error">Course not found.</div>;
  }

  return (
    <div className="course-page">
      <div className="course-header">
        <h1>{courseName.course_name}</h1>
        <p className="course-code">Course Code: {courseId}</p>
      </div>

      <div className="course-tabs">
        <button
          className={`tab ${activeTab === 'stream' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('stream');
            navigate(`/course/${courseId}/stream/${chatId}`);
          }}
        >
          Stream
        </button>
        <button
          className={`tab ${activeTab === 'classwork' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('classwork');
            navigate(`/course/${courseId}/classwork`);
          }}
        >
          Classwork
        </button>
        <button
          className={`tab ${activeTab === 'people' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('people')
            navigate(`/course/${courseId}/student`);
          }}
        >
          People
        </button>
        <button
          className={`tab ${activeTab === 'grades' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('grades')
            navigate(`/course/${courseId}/grades`);
          }}
        >
          Grades
        </button>
      </div>

      <div className="course-content">{children}</div>
    </div>
  );
};

export default CoursePage;