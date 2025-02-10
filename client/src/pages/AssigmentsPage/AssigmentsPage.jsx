import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AssignmentsPage.css';
import { getAllStudentAssigments, getFilteredCourses } from '../../api/materialService';

const AssignmentsPage = ({ user_id, role }) => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchAssignmentsDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!user_id) return;
        if (role === "Student") {
          const data = await getAllStudentAssigments(user_id);
          setAssignments(data);
          setFilteredAssignments(data);
        } else {
          const data = await getFilteredCourses(user_id, "");
          setCourses(data);
          console.log(data)
        }
      } catch (error) {
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentsDetails();
  }, [user_id, role]);

  useEffect(() => {
    const fetchFilteredData = async () => {
      if (role === "Student") {
        if (filter === 'all') {
          setFilteredAssignments(assignments);
        } else if (filter === "passed") {
          setFilteredAssignments(assignments.filter(assignment =>
            assignment.userAssignment.status === 'passed_in_time' ||
            assignment.userAssignment.status === 'passed_with_lateness'
          ));
        } else {
          setFilteredAssignments(assignments.filter(assignment => assignment.userAssignment.status === filter));
        }
      }

      if (role === "Teacher") {
        const data = await getFilteredCourses(user_id, filter === "all" ? "" : filter);
        setCourses(data);
      }
    };

    fetchFilteredData();
  }, [filter, assignments, user_id, role]);

  const [openedCourse, setOpenedCourse] = useState("")
  const [openedTask, setOpenedTasks] = useState("")

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="assignments-container">
      <h1>Assignments</h1>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('graded')}>Graded</button>
        <button onClick={() => setFilter('passed')}>Submitted</button>
        <button onClick={() => setFilter('not_passed')}>Not Submitted</button>
      </div>
      {role === 'Teacher' ? (
        <div className="courses-table">
          <h3>Your Courses</h3>
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr><td colSpan="2">No courses available</td></tr>
              ) : (
                courses.map(course => (
                  <React.Fragment key={course.course_id}>
                    <tr>
                      <td>{course.course_name}</td>
                      <td>
                        <button onClick={() => setOpenedCourse((course.course_id === openedCourse) ? "" : course.course_id)} aria-label={(course.course_id === openedCourse) ? "Hide tasks" : "Show tasks"}>
                          {(course.course_id === openedCourse) ? "Hide tasks" : "Show tasks"}
                        </button>
                      </td>
                    </tr>
                    {(course.course_id === openedCourse) && course.tasks.map(assignment => (
                      <React.Fragment key={assignment._id}>
                        <tr>
                          <td colSpan="2">
                            <div className="assignment-item">
                              <span>{assignment.title}</span>
                              <button onClick={() => setOpenedTasks((assignment._id === openedTask) ? "" : assignment._id)} aria-label={(assignment._id === openedTask) ? 'Hide Students' : 'Show Students'}>
                                {(assignment._id === openedTask) ? 'Hide Students' : 'Show Students'}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {(assignment._id === openedTask) && (
                          <tr>
                            <td colSpan="2">
                              <table className="grading-table">
                                <thead>
                                  <tr>
                                    <th>Student</th>
                                    <th>Status</th>
                                    <th>Grade</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {assignment.students.map(student => (
                                    <tr key={student.user_id}>
                                      <td>{student.user_id}</td>
                                      <td>{student.status}</td>
                                      <td>{student.grade || 'Not graded'}</td>
                                      <td>
                                        <button onClick={() => navigate(`/assignment/${assignment._id}?ref=${student.user_id}`)}>
                                          {student.status === "graded" ? "Change grade" : "Grade"}
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>)}
                      </React.Fragment>))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <div className="assignments-grid">
            {filteredAssignments.length === 0 ? (
              <div>No assignments available</div>
            ) : (
              filteredAssignments.map((assignment) => (
                <div key={assignment._id} className="assignment-card">
                  <h3>{assignment.title}</h3>
                  <span className={`status ${assignment.userAssignment.status}`}>{assignment.userAssignment.status}</span>
                  <p>{assignment.description}</p>
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  <span>Points: {assignment.points}</span>
                  <button onClick={() => navigate(`/assignment/${assignment._id}`)}>View Details</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
