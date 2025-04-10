import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../AssigmentsList.module.css"

const AssignmentsPage = ({students, assignmentId}) => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log(students)
    }, [students])

    return (
        <table className={styles.gradingTable}>
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Grade</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {students.map(student => (
                    <tr key={student.user_id}>
                        <td>{student.name}</td>
                        <td>{student.status}</td>
                        <td>{student.grade || 'Not graded'}</td>
                        <td>
                            <button onClick={() => navigate(`/assignment/${assignmentId}?ref=${student.user_id}`)}>
                                {student.status === "graded" ? "Change grade" : "Grade"}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AssignmentsPage;
