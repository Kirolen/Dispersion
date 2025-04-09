import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './StudentAssignmentsList.module.css';
import { useSelector } from 'react-redux';
import { getAllStudentAssigments } from '../../api/materialService';

const StudentAssignmentsList = ({ filter }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [assignments, setAssignments] = useState([])
    const [filteredAssignments, setFilteredAssignments] = useState([])
    const { user_id } = useSelector((state) => state.user);


    useEffect(() => {
        const fetchAssignmentsDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                if (user_id.toString() === "-1") return;
                console.log(user_id)
                const data = await getAllStudentAssigments(user_id);
                setAssignments(data);
                console.log(data)
                setFilteredAssignments(data);
            } catch (error) {
                setError('Error fetching data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignmentsDetails();
    }, [user_id]);

    useEffect(() => {
        const fetchFilteredData = async () => {
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
        };

        fetchFilteredData();
    }, [filter, assignments, user_id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div className={styles.studentAssignmentsList}>
                {filteredAssignments.length === 0 ? (
                    <div>No assignments available</div>
                ) : (
                    filteredAssignments.map((assignment) => (
                        <div key={assignment._id} className={styles.assignmentCard}>
                            <h3>{`${assignment.title} - Due: ${new Date(assignment.dueDate).toLocaleString('uk-UA', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })} - Points: ${assignment.points} - ${assignment.userAssignment.status}
                                ${assignment.userAssignment.status === "graded" ? assignment.userAssignment.grade : ""}`}</h3>
                            <p>Description: {assignment.description}</p>
                            <button onClick={() => navigate(`/assignment/${assignment._id}`)}>View Details</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentAssignmentsList;
