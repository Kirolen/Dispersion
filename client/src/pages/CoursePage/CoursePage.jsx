import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CoursePage.css';
import { mockCourses } from "../../mockData/mockData";
import {getCourseInfo} from '../../api//courseService'

const CoursePage = ({children}) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stream');
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [localAssignments, setLocalAssignments] = useState([]);
  const [workForm, setWorkForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    points: 100,
    attachments: [],
    test: null
  });

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        if (courseId === "1") {
          setCourse(mockCourses()[0]);
        }
        else {
          const res = await getCourseInfo(courseId);
          console.log(res)
          setCourse(res)
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);


  const handleWorkSubmit = (e) => {
    e.preventDefault();
    const newAssignment = {
      id: Date.now(),
      ...workForm,
      createdAt: new Date().toLocaleString()
    };

    setLocalAssignments([newAssignment, ...localAssignments]);
    setWorkForm({
      title: '',
      description: '',
      dueDate: '',
      dueTime: '',
      points: 100,
      attachments: [],
      test: null
    });
    setShowWorkForm(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setWorkForm(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setWorkForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleAddTest = () => {
    navigate('/test');
  };

  if (loading) {
    return <div className="loading">Loading course details...</div>;
  }

  if (!course) {
    return <div className="error">Course not found.</div>;
  }

  return (
    <div className="course-page">
      <div className="course-header">
        <h1>{course.course_name}</h1>
        <p className="course-code">Course Code: {course._id}</p>
      </div>

      <div className="course-tabs">
        <button
          className={`tab ${activeTab === 'stream' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('stream');
            navigate(`/course/${courseId}/stream`);
          }}
        >
          Stream
        </button>
        <button
          className={`tab ${activeTab === 'classwork' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('classwork');
            navigate(`/course/${courseId}/classwork`);
          }}
        >
          Classwork
        </button>
        <button
          className={`tab ${activeTab === 'people' ? 'active' : ''}`}
          onClick={() => setActiveTab('people')}
        >
          People
        </button>
        <button
          className={`tab ${activeTab === 'grades' ? 'active' : ''}`}
          onClick={() => setActiveTab('grades')}
        >
          Grades
        </button>
      </div>

      <div className="course-content">
        {children}
        {/*{activeTab === 'people' && (
          <div className="people-section">
            <div className="teachers-list">
              <h2>Teachers</h2>
              <div className="person-card">
                <span className="person-name">{course.teacher.name}</span>
                <span className="person-email">{course.teacher.email}</span>
              </div>
            </div>
            <div className="students-list">
              <h2>Students</h2>
              {course.students?.length > 0 ? (
                course.students.map((student, index) => (
                  <div key={index} className="person-card">
                    <span className="person-name">{student.first_name + " " + student.last_name}</span>
                    <span className="person-email">{student.email}</span>
                  </div>
                ))
              ) : (
                <div className="no-content">No students enrolled yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="grades-section">
            <div className="grades-header">
              <h2>Grade Book</h2>
              <button className="export-button">Export Grades</button>
            </div>
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Assignment</th>
                  <th>Submitted</th>
                  <th>Grade</th>
                  <th>Feedback</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {course.assignments.flatMap(assignment => 
                  assignment.submissions.map(submission => {
                    const student = course.students.find(s => s.id === submission.student_id);
                    return (
                      <tr key={`${assignment.id}-${submission.student_id}`}>
                        <td>{`${student?.first_name} ${student?.last_name}`}</td>
                        <td>{assignment.title}</td>
                        <td>{new Date(submission.submitted_at).toLocaleDateString()}</td>
                        <td>{submission.grade || 'Not graded'}</td>
                        <td>{submission.feedback || 'No feedback'}</td>
                        <td>
                          <button 
                            className="grade-button"
                            onClick={() => navigate(`/assignment/${assignment.id}`)}
                          >
                            Grade
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}*/}
      </div>
    </div>
  );
};

export default CoursePage;