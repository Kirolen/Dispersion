import React from 'react';
import styles from './TeacherAssigmentsList.module.css';
import TeacherCourseTable from './TeacherCourseTable/TeacherCourseTable';

const TeacherAssigmentsList = ({ filter }) => {
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

export default TeacherAssigmentsList;
