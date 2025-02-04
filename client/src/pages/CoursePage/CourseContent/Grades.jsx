import React, { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { mockCourses } from '../../../mockData/mockData';

const Grades = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [courseGrades, setcourseGrades] = useState([]);

    useEffect(() => {
        const fetchCourseDetails = async () => {
          try {
            if (courseId === "1") {
                setcourseGrades(mockCourses());
            } else {
                setcourseGrades(mockCourses());
            }
          } catch (error) {
            console.error('Error fetching course details:', error);
          }
        };
    
        fetchCourseDetails();
      }, [courseId]);

    return (
        <div className="grades-section">
            <div className="grades-header">
              <h2>Grade Book</h2>
              <button className="export-button">Export Grades</button>
            </div>
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Assignment</th>
                  <th>Submitted</th>
                  <th>Grade</th>
                  <th>Feedback</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courseGrades.assignment?.flatMap(assignment => 
                  assignment.submissions.map(submission => {
                    const student = courseGrades.students.find(s => s.id === submission.student_id);
                    return (
                      <tr key={`${assignment.id}-${submission.student_id}`}>
                        <td>{`${student?.first_name} ${student?.last_name}`}</td>
                        <td>{assignment.title}</td>
                        <td>{new Date(submission.submitted_at).toLocaleDateString()}</td>
                        <td>{submission.grade || 'Not graded'}</td>
                        <td>{submission.feedback || 'No feedback'}</td>
                        <td>
                          <button 
                            className="grade-button"
                            onClick={() => navigate(`/assignment/${assignment.id}`)}
                          >
                            Grade
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
    )
}

export default Grades;