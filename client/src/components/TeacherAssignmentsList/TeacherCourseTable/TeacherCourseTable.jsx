import React, { useEffect, useState } from 'react';
import { getFilteredCourses } from '../../../api/materialService';
import { useSelector } from 'react-redux';
import styles from '../TeacherAssigmentsList.module.css';
import TeacherAssigmentsTable from '../TeacherAssigmentsTable/TeacherAssigmentsTable';

const TeacherCourseTable = ({ filter }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openedCourse, setOpenedCourse] = useState("")
    const { user_id } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchAssignmentsDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!user_id) return;
                const data = await getFilteredCourses(user_id, "");
                setCourses(data);
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
            const data = await getFilteredCourses(user_id, filter === "all" ? "" : filter);
            setCourses(data);
        };

        fetchFilteredData();
    }, [filter, user_id]);

    if (loading) {
        return (
            <tbody>
                <tr>
                    <td colSpan="2">Loading...</td>
                </tr>
            </tbody>
        );
    }
    
    if (error) {
        return (
            <tbody>
                <tr>
                    <td colSpan="2">{error}</td>
                </tr>
            </tbody>
        );
    }
    

    return (
        <tbody className={styles.courseTable}>
            {courses.length === 0 ? (
                <tr><td colSpan="2">No courses available</td></tr>
            ) : (
                courses.map(course => (
                    <React.Fragment key={course.course_id}>
                        <tr key={course.course_id}>
                            <td>{course.course_name}</td>
                            <td>
                                <button className={`${course.course_id === openedCourse ? styles.active : ""}`} onClick={() => setOpenedCourse((course.course_id === openedCourse) ? "" : course.course_id)}>
                                    {(course.course_id === openedCourse) ? "Hide tasks" : "Show tasks"}
                                </button>
                            </td>
                        </tr>
                        {course.course_id === openedCourse && <TeacherAssigmentsTable assignments={course.tasks} />}
                    </React.Fragment>
                ))
            )}
        </tbody>
    );
};

export default TeacherCourseTable;
