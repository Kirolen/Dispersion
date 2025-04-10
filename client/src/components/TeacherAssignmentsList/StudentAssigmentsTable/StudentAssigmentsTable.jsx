import React  from 'react';
import styles from '../AssigmentsList.module.css';
import { useNavigate } from 'react-router-dom';

const StudentAssigmentsTable = ({ assignments }) => {
    const navigate = useNavigate();
    return (
        <>
            <table className={styles.assignmentsTable}>
                        <thead>
                            <tr>
                                <th>Student</th>
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

            {/* <tr>
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
                                            <button onClick={() => navigate(`/assignment/${assignment.material_id}`)}>
                                                View assignment
                                            </button>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </td>
            </tr> */}
        </>
    );
};

export default StudentAssigmentsTable;
