import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllCourseMaterials, getStudentsTasksResult, getStudentTasksResult } from '../../api/materialService'
import { useSelector } from 'react-redux';
import TeacherAssigmentsTable from '../TeacherAssignmentsList/TeacherAssigmentsTable/TeacherAssigmentsTable';
import { getAllAssignmentsForOneCourseByTeacher } from '../../api/materialService'
import styles from './Grades.module.css'

const Grades = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const { user_id, role } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                let assignments;
                if (role === "Teacher") assignments = await getAllAssignmentsForOneCourseByTeacher(user_id, courseId);
                else if (role === "Student") assignments = await getStudentTasksResult(courseId, user_id);
                console.log(assignments)
                if (assignments) setAssignments(assignments)
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };
        fetchCourseDetails();
    }, [courseId]);


    return (
        <div className="grades-section">
            <h2>Grade Book</h2>

            {role === 'Teacher' ? (
                <table className={styles.gradeTable}>
                    <tbody>
                        <TeacherAssigmentsTable assignments={assignments} />
                    </tbody>
                </table>
            ) : (
                <table className="student-grades-table">
                    <thead>
                        <tr>
                            <th>Assignment</th>
                            <th>Status</th>
                            <th>Grade</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((assignment) => {
                            return (
                                <tr key={assignment._id}>
                                    <td>{assignment.title}</td>
                                    <td>{assignment.status || 'Not submitted'}</td>
                                    <td>{assignment.grade || 'Not graded'}</td>
                                    <td>
                                        <button className="grade-button" onClick={() => navigate(`/assignment/${assignment._id}`)}>
                                            View
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Grades;
