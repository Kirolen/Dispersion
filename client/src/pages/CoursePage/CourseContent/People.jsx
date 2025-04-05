import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoursePeople } from '../../../api/courseService';

const People = () => {
  const { courseId } = useParams();
  const [courseInfoPeople, setCourseInfoPeople] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await getCoursePeople(courseId);
        setCourseInfoPeople(res);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (!courseInfoPeople) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="people-section">
      <div className="teachers-list">
        <h2>Teachers</h2>
        {courseInfoPeople.teacher ? (
          <div className="person-card">
            <span className="person-name">{courseInfoPeople.teacher.name}</span>
            <span className="person-email">{courseInfoPeople.teacher.email}</span>
          </div>
        ) : (
          <div className="no-content">No teacher information available.</div>
        )}
      </div>
      <div className="students-list">
        <h2>Students</h2>
        {courseInfoPeople.students?.length > 0 ? (
          courseInfoPeople.students.map((student, index) => (
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
  );
};

export default People;
