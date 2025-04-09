import React, { useEffect, useState } from 'react';
import styles from './AssignmentsPage.module.css';
import { useSelector } from 'react-redux';
import TeacherAssigmentsList from '../../components/TeacherAssignmentsList/TeacherAssigmentsList';
import StudentAssignmentsList from '../../components/StudentAssignmentsList/StudentAssignmentsList';

const AssignmentsPage = () => {
  const [filter, setFilter] = useState('');
  const { user_id, role } = useSelector((state) => state.user);

  useEffect(() => {
      if (role === "Student") setFilter('not_passed')
      else if (role === "Teacher") setFilter('passed')
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
      ) : ( <StudentAssignmentsList filter={filter}/>
      )}
    </div>
  );
};

export default AssignmentsPage;
