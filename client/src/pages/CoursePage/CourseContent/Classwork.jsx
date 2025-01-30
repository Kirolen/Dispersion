import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Classwork = () => {
  const navigate = useNavigate();
      const [showWorkForm, setShowWorkForm] = useState(false);
      const [course, setCourse] = useState(null);
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
    

    return (
        <div className="classwork-section">
            <div className="add-work">
              <button className="add-work-button" onClick={() => setShowWorkForm(true)}>
                + Add Assignment
              </button>
            </div>

            {showWorkForm && (
              <div className="work-form-overlay">
                <div className="work-form">
                  <h2>Create Assignment</h2>
                  <form onSubmit={handleWorkSubmit}>
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={workForm.title}
                        onChange={(e) => setWorkForm({...workForm, title: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={workForm.description}
                        onChange={(e) => setWorkForm({...workForm, description: e.target.value})}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Due Date</label>
                        <input
                          type="date"
                          value={workForm.dueDate}
                          onChange={(e) => setWorkForm({...workForm, dueDate: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Due Time</label>
                        <input
                          type="time"
                          value={workForm.dueTime}
                          onChange={(e) => setWorkForm({...workForm, dueTime: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Points</label>
                        <input
                          type="number"
                          value={workForm.points}
                          onChange={(e) => setWorkForm({...workForm, points: e.target.value})}
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Attachments</label>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="file-input"
                      />
                      <div className="attachments-preview">
                        {workForm.attachments.map((file, index) => (
                          <div key={index} className="attachment-item">
                            <span>{file.name}</span>
                            <button type="button" onClick={() => removeAttachment(index)}>×</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <button type="button" className="add-test-button" onClick={handleAddTest}>
                        {workForm.test ? 'Edit Test' : 'Add Test'}
                      </button>
                      {workForm.test && (
                        <div className="test-preview">
                          <h4>{workForm.test.title}</h4>
                          <p>{workForm.test.questions.length} questions</p>
                        </div>
                      )}
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="submit-button">Create Assignment</button>
                      <button type="button" className="cancel-button" onClick={() => setShowWorkForm(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="work-list">
              {[...localAssignments, ...(course?.assignments || [])].map((assignment, index) => (
                <div key={assignment.id || index} className="assignment-card">
                  <h3>{assignment.title}</h3>
                  <p>{assignment.description}</p>
                  {assignment.test && (
                    <div className="assignment-test">
                      <span className="test-icon">📝</span>
                      <span>Test attached: {assignment.test.title}</span>
                    </div>
                  )}
                  {assignment.attachments?.length > 0 && (
                    <div className="assignment-attachments">
                      <span className="attachment-icon">📎</span>
                      <span>{assignment.attachments.length} attachments</span>
                    </div>
                  )}
                  <div className="assignment-footer">
                    <span>Due: {assignment.dueDate} {assignment.dueTime}</span>
                    <span>{assignment.points} points</span>
                    <button className="view-button">View Assignment</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
    )
}

export default Classwork