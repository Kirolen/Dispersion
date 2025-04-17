import React  from 'react';
import styles from './StudentAssigmentsTable.module.css';
import { useNavigate } from 'react-router-dom';

const StudentAssigmentsTable = ({ assignments }) => {
    const navigate = useNavigate();
    return (
        <>
            <table className={styles.assignmentsTable}>
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Status</th>
                                <th>Grade</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map(assignment => (
                                <tr key={assignment.material_id}>
                                    <td>{assignment.title}</td>
                                    <td>{assignment.status}</td>
                                    <td>{assignment.grade || 'Not graded'}</td>
                                    <td>
                                        <button onClick={() => navigate(`/assignment/${assignment.material_id}`)}>
                                            Viev Assignment
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
        </>
    );
};

export default StudentAssigmentsTable;
