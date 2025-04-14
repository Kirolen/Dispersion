import React, { useEffect, useState } from 'react';
import { getFilteredAssignmentsByStudent, getFilteredCoursesAssignmentsForTeacher } from '../../../api/materialService';
import { useSelector } from 'react-redux';
import styles from '../AssigmentsList.module.css';
import TeacherAssigmentsTable from '../TeacherAssigmentsTable/TeacherAssigmentsTable';
import StudentAssigmentsTable from '../StudentAssigmentsTable/StudentAssigmentsTable';

const CoursesTable = ({ filter }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openedCourse, setOpenedCourse] = useState("")
    const {role, user_id } = useSelector((state) => state.user);

    useEffect(() => {
        if (user_id.toString() === "-1" || filter === "") return;
        setLoading(true);
        setError(null);
        const fetchFilteredData = async () => {
            try {
                let data = [];
                if (role === "Teacher") data = await getFilteredCoursesAssignmentsForTeacher(user_id, filter === "all" ? "" : filter);
                else if (role === "Student") data = await getFilteredAssignmentsByStudent(user_id, filter)
                console.log("Filtered: ")
                console.log(data)
                setCourses(data);
            } catch (error) {
                setError('Error fetching data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchFilteredData();
    }, [filter, user_id, role]);

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
                        {course.course_id === openedCourse && role === "Teacher" &&  <TeacherAssigmentsTable assignments={course.tasks} />}
                        {course.course_id === openedCourse && role === "Student" && <StudentAssigmentsTable assignments={course.tasks}/>}
                    </React.Fragment>
                ))
            )}
        </tbody>
    );
};

export default CoursesTable;
