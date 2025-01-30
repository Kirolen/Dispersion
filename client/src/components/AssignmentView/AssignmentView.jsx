import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AssignmentView.css';
import { mockAssignments } from '../../mockData/mockData';

const AssignmentView = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [grade, setGrade] = useState('');
  
  const assignment = mockAssignments.find(a => a.id === assignmentId);
  
  if (!assignment) {
    return <div className="not-found">Assignment not found</div>;
  }

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    // Here you would typically submit the grade to an API
    console.log('Grade submitted:', { grade, feedback });
    alert('Grade submitted successfully!');
  };

  return (
    <div className="assignment-view">
      <div className="assignment-view-header">
        <h1>{assignment.title}</h1>
        <button onClick={() => navigate(-1)} className="back-button">
          Back to Assignments
        </button>
      </div>

      <div className="assignment-view-content">
        <div className="assignment-details">
          <h2>Assignment Details</h2>
          <p className="description">{assignment.description}</p>
          <div className="meta-info">
            <span>Due Date: {new Date(assignment.dueDate).toLocaleDateString()}</span>
            <span>Points: {assignment.points}</span>
            <span>Status: {assignment.status}</span>
          </div>
        </div>

        {assignment.submissions.length > 0 && (
          <div className="submissions-section">
            <h2>Submissions</h2>
            {assignment.submissions.map((submission, index) => (
              <div key={index} className="submission-card">
                <div className="submission-header">
                  <span>Submitted: {new Date(submission.submitted_at).toLocaleString()}</span>
                  {submission.grade && <span>Grade: {submission.grade}/{assignment.points}</span>}
                </div>
                {submission.feedback && (
                  <div className="feedback">
                    <h3>Feedback</h3>
                    <p>{submission.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grading-section">
          <h2>Grade Assignment</h2>
          <form onSubmit={handleGradeSubmit} className="grade-form">
            <div className="form-group">
              <label>Grade (out of {assignment.points})</label>
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                max={assignment.points}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback..."
              />
            </div>
            <button type="submit" className="submit-grade">Submit Grade</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignmentView;