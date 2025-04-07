import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AssignmentsPage.module.css';
import { useSelector } from 'react-redux';
import TeacherAssigmentsList from '../../components/TeacherAssignmentsList/TeacherAssigmentsList';

const AssignmentsPage = () => {
  const navigate = useNavigate();
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [filter, setFilter] = useState('all');
  const { user_id, role } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("role: " + role)
  }, [user_id, role]);


  return (
    <div className={styles.assignmentsContainer}>
      <div className={styles.assignmentsHeader}>
        <h1>Assignments</h1>
      </div>
      <div className={styles.filters}>
        <button className={`${styles.filterButton} ${filter === "all" ? styles.active : ""}`} onClick={() => setFilter('all')}>All</button>
        <button className={`${styles.filterButton} ${filter === "graded" ? styles.active : ""}`} onClick={() => setFilter('graded')}>Graded</button>
        <button className={`${styles.filterButton} ${filter === "passed" ? styles.active : ""}`} onClick={() => setFilter('passed')}>Submitted</button>
        <button className={`${styles.filterButton} ${filter === "not_passed" ? styles.active : ""}`} onClick={() => setFilter('not_passed')}>Not Submitted</button>
      </div>
      {role === 'Teacher' ? (
        <TeacherAssigmentsList filter={filter}/>
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
