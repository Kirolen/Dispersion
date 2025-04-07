import React, { useState } from 'react';
import styles from '../TeacherAssigmentsList.module.css';
import TeacherGradingTable from '../TeacherGradingTable/TeacherGradingTable'; 

const TeacherAssigmentsTable = ({ assignments }) => {
    const [openedTask, setOpenedTask] = useState(null);

    return (
        <>
            <tr>
                <td colSpan="2">
                    <table className={styles.assignmentsTable}>
                        <thead>
                            <tr>
                                <th className={styles.innerTable}>Assignment Name</th>
                                <th className={styles.innerTable}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map((assignment) => (
                                <React.Fragment key={assignment._id}>
                                    <tr className={styles.innerTable}>
                                        <td>{assignment.title}</td>
                                        <td>
                                            <button
                                                className={`${assignment._id === openedTask ? styles.active : ""}`}
                                                onClick={() =>
                                                    setOpenedTask(
                                                        assignment._id === openedTask ? null : assignment._id
                                                    )
                                                }
                                            >
                                                {assignment._id === openedTask ? 'Hide Students' : 'Show Students'}
                                            </button>
                                        </td>
                                    </tr>
                                    {assignment._id === openedTask && (
                                        <tr>
                                            <td colSpan="2">
                                                <TeacherGradingTable
                                                    students={assignment.students}
                                                    assignmentId={assignment._id}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </td>
            </tr>
        </>
    );
};

export default TeacherAssigmentsTable;
