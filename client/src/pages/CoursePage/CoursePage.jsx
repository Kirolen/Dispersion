import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseInfo } from '../../api//courseService'
import styles from './CoursePage.module.css'

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

  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };


  if (loading) {
    return <div className="loading">Loading course details...</div>;
  }

  if (!courseName) {
    return <div className="error">Course not found.</div>;
  }

  return (
    <div className={styles.coursePageContainer}>
      <div className={styles.courseHeader}>
        <h1>{courseName.course_name}</h1>
        <p className={styles.code}>Course Code: {courseId}</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'stream' ? styles.active : ''}`}
          onClick={() => handleTabClick('stream', `/course/${courseId}/stream/${chatId}`)}>
          Stream
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'classwork' ? styles.active : ''}`}
          onClick={() => handleTabClick('classwork', `/course/${courseId}/classwork`)}>
          Classwork
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'student' ? styles.active : ''}`}
          onClick={() => handleTabClick('student', `/course/${courseId}/student`)}>
          People
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'grades' ? styles.active : ''}`}
          onClick={() => handleTabClick('grades', `/course/${courseId}/grades`)}>
          Grades
        </button>
      </div>
      
      <div className={styles.courseContent}>{children}</div>
    </div>
  );
};

export default CoursePage;