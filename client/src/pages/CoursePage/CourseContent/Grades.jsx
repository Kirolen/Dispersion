import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./CourseContentStyles/Grades.css"
import { getAllCourseMaterials, getStudentsTasksResult, getStudentTasksResult } from '../../../api/materialService'
import { useSelector } from 'react-redux';

const Grades = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [studentSubmissions, setStudentSubmissions] = useState([]);
    const { user_id, role } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                let assignments;

                if (role === "Teacher") assignments = await getAllCourseMaterials(courseId);
                else if (role === "Student") assignments = await getStudentTasksResult(courseId, user_id);

                if (assignments) setAssignments(assignments)
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };
        fetchCourseDetails();
    }, [courseId]);

    const handleOpenGrading = async (assignment) => {
        console.log("Opening assigment...")
        setSelectedAssignment(assignment);
        const taskStatus = await getStudentsTasksResult(assignment._id);
        if (Array.isArray(taskStatus.data)) {
            setStudentSubmissions(taskStatus.data);
        } else {
            console.error("Expected taskStatus to be an array, but got:", taskStatus);
        }
    };

    return (
        <div className="grades-section">
            <h2>Grade Book</h2>

            {role === 'Teacher' ? (
                <>
                    <div className="assignment-list">
                        {assignments.map((assignment) => (
                            <div key={assignment._id} className="assignment-item">
                                <h3>{assignment.title}</h3>
                                <button className="grade-button" onClick={() => handleOpenGrading(assignment)}>
                                    Grade
                                </button>
                            </div>
                        ))}
                    </div>

                    {selectedAssignment && (
                        <div className="grading-table">
                            <h3>Grading: {selectedAssignment.title}</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Status</th>
                                        <th>Grade</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentSubmissions.map(submission => {
                                        return (
                                            <tr key={submission.student_id}>
                                                <td>{submission.name}</td>
                                                <td>{submission.status}</td>
                                                <td>{submission.grade || 'Not graded'}</td>
                                                <td>
                                                    <button className="grade-button" onClick={() => navigate(`/assignment/${selectedAssignment._id}?ref=${submission.student_id}`)}>
                                                        {submission.status === "graded" ? "Change grade" : "Grade"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
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
