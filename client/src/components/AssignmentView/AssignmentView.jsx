import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskInfoForStudent } from '../../api/materialService'
import './AssignmentView.css';

const AssignmentView = ({ user_id, role }) => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [grade, setGrade] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        const data = await getTaskInfoForStudent(assignmentId, user_id);
        console.log(data)
        setAssignment(data.data);
        setStatus(data.userDetails?.status || 'Не здано');
      } catch (error) {
        console.error('Error fetching assignment details:', error);
      }
    };

    fetchAssignmentDetails();
  }, [assignmentId, user_id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitAssignment = async () => {
    if (!file) return alert('Будь ласка, виберіть файл для завантаження.');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', user_id);
      formData.append('material_id', assignmentId);

      //const response = await submitAssignment(formData);
      //alert(response.message);
      setStatus('Здано');
    } catch (error) {
      console.error('Error submitting assignment:', error);
    }
  };

  const handleReturnAssignment = async () => {
    try {
      //const response = await submitAssignment({ user_id, material_id: assignmentId, action: 'return' });
      //alert(response.message);
      setStatus('Не здано');
    } catch (error) {
      console.error('Error returning assignment:', error);
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      //const response = await gradeAssignment(assignmentId, user_id, grade, feedback);
      //alert(response.message);
    } catch (error) {
      console.error('Error grading assignment:', error);
    }
  };

  if (!assignment) {
    return <div className="not-found">Assignment not found</div>;
  }

  return (
    <div className="assignment-view">
      <div className="assignment-view-header">
        <h1>{assignment.title}</h1>
        <button onClick={() => navigate(-1)} className="back-button">Back to Assignments</button>
      </div>

      <div className="assignment-view-content">
        <div className="assignment-details">
          <h2>Assignment Details</h2>
          <p className="description">{assignment.description}</p>
          <div className="meta-info">
          <span>Due Date: {new Date(assignment.dueDate).toLocaleString('en-GB', { 
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', 
    hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' })}</span>
            
            <span>Points: {assignment.points}</span>
            <span>Status: {status}</span>
          </div>
        </div>

        {role === 'Student' && (
          <div className="submission-section">
            <h2>{status === 'Здано' ? 'Ваше подання' : 'Подати завдання'}</h2>
            {status !== 'Здано' ? (
              <>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleSubmitAssignment} className="submit-button">Submit Assignment</button>
              </>
            ) : (
              <button onClick={handleReturnAssignment} className="return-button">Return Assignment</button>
            )}
          </div>
        )}

        {role === 'Teacher' && (
          <div className="grading-section">
            <h2>Оцінити завдання</h2>
            <form onSubmit={handleGradeSubmit} className="grade-form">
              <div className="form-group">
                <label>Grade (out of {assignment.points})</label>
                <input type="number" value={grade} onChange={(e) => setGrade(e.target.value)} max={assignment.points} min="0" />
              </div>
              <div className="form-group">
                <label>Feedback</label>
                <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Provide feedback..." />
              </div>
              <button type="submit" className="submit-grade">Submit Grade</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignmentView;
