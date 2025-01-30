import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AssignmentsPage.css';
import { mockAssignments } from '../../mockData/mockData';

const AssignmentsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="assignments-container">
      <div className="assignments-header">
        <h1>Assignments</h1>
      </div>

      <div className="assignments-grid">
        {mockAssignments.map((assignment) => (
          <div key={assignment.id} className="assignment-card">
            <div className="assignment-header">
              <h3>{assignment.title}</h3>
              <span className={`status ${assignment.status}`}>
                {assignment.status}
              </span>
            </div>
            <p className="assignment-description">{assignment.description}</p>
            <div className="assignment-details">
              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
              <span>Points: {assignment.points}</span>
            </div>
            <div className="assignment-actions">
              <button 
                className="view-button"
                onClick={() => navigate(`/assignment/${assignment.id}`)}
              >
                View Details
              </button>
              {assignment.submissions.length > 0 && (
                <span className="submitted-label">Submitted</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentsPage;