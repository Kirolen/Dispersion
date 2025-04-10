import React from 'react';
import styles from './AssigmentsList.module.css';
import TeacherCourseTable from './CoursesTable/CoursesTable';

const AssigmentsList = ({ filter }) => {
    return (
        <table className={styles.mainTable}>
            <thead>
                <tr>
                    <th>Course Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <TeacherCourseTable filter={filter}/>
        </table>
    );
};

export default AssigmentsList;
