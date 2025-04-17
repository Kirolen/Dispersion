import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllCourseMaterials, getStudentsTasksResult, getStudentTasksResult } from '../../api/materialService'
import { useSelector } from 'react-redux';
import TeacherAssigmentsTable from '../TeacherAssignmentsList/TeacherAssigmentsTable/TeacherAssigmentsTable';
import { getAllAssignmentsForOneCourseByTeacher } from '../../api/materialService'
import styles from './Grades.module.css'
import StudentAssigmentsTable from '../TeacherAssignmentsList/StudentAssigmentsTable/StudentAssigmentsTable';

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
                <table className={styles.gradeTable}>
                    <tbody>
                        <StudentAssigmentsTable assignments={assignments}/>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Grades;
