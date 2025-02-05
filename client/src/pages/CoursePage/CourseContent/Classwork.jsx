import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoursePeople } from '../../../api/courseService';
import { useNavigate } from 'react-router-dom';
import { addMaterial, getAllMaterials, getMaterials } from '../../../api/materialService'



const Classwork = ({ role, user_id }) => {

  const navigate = useNavigate();
  const { courseId } = useParams();
  const [materialType, setMaterialType] = useState("")
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [publishedAssignments, setPublishedAssignments] = useState([]);
  const [users, setUsers] = useState(null);
  const [workForm, setWorkForm] = useState({
    title: '',
    description: '',
    attachments: [],
    dueDate: '',
    dueTime: '',
    points: 100,
    assignedUsers: []
  });

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        console.log(role)
        const people = await getCoursePeople(courseId);
        setUsers(people);
        let assignments;
        if (role === "Teacher") {
          assignments = await getAllMaterials(courseId);
        }
        else {
          assignments = await getMaterials(courseId, user_id);
        }
        setPublishedAssignments(assignments);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);


  const handleWorkSubmit = async (e) => {
    e.preventDefault();

    const dueDateTime = new Date(`${workForm.dueDate}T00:00:00.000Z`);
    if (workForm.dueTime) {
      const [hours, minutes] = workForm.dueTime.split(":").map(Number);
      dueDateTime.setUTCHours(hours, minutes, 0, 0);
    }

    try {
      await addMaterial(
        workForm.title,
        workForm.description,
        materialType,
        dueDateTime,
        workForm.points,
        courseId,
        workForm.assignedUsers,
        workForm.attachments
      );

      setWorkForm({
        title: '',
        description: '',
        dueDate: '',
        dueTime: '',
        points: 100,
        attachments: [],
        assignedUsers: [],
      });

      setShowWorkForm(false);
      setMaterialType('');

      const updatedAssignments = await getAllMaterials(courseId);
      setPublishedAssignments(updatedAssignments);
    } catch (error) {
      console.error('Error adding material:', error);
    }
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

  return (
    <div className="classwork-section">
      {role === "Teacher" && <>
        <div className="add-work">
          <button className="add-work-button" onClick={() => setShowWorkForm(true)}>
            + Add Assignment
          </button>
        </div>

        {showWorkForm && !(materialType.trim().length > 0) && (
          <div className="material-type-selection">
            <h2>Select Material Type</h2>
            <button className="material-button" onClick={() => setMaterialType('lecture')}>
              Lecture Material
            </button>
            <button className="material-button" onClick={() => setMaterialType('practice')}>
              Practical Material
            </button>
          </div>

        )}

        {showWorkForm && (materialType.trim().length > 0) && (
          <div className="work-form-overlay">
            <div className="work-form">
              <h2>Create Assignment</h2>
              <form onSubmit={handleWorkSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={workForm.title}
                    onChange={(e) => setWorkForm({ ...workForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={workForm.description}
                    onChange={(e) => setWorkForm({ ...workForm, description: e.target.value })}
                  />
                </div>

                {materialType === 'practice' &&
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Due Date</label>
                        <input
                          type="date"
                          value={workForm.dueDate}
                          onChange={(e) => setWorkForm({ ...workForm, dueDate: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Due Time</label>
                        <input
                          type="time"
                          value={workForm.dueTime}
                          onChange={(e) => setWorkForm({ ...workForm, dueTime: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Points</label>
                        <input
                          type="number"
                          value={workForm.points}
                          onChange={(e) => setWorkForm({ ...workForm, points: e.target.value })}
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Assign to Users</label>
                      <select
                        multiple
                        onChange={(e) => {
                          const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);

                          if (selectedValues.includes("all")) {
                            setWorkForm({ ...workForm, assignedUsers: users.students.map(student => student.id) });
                          } else {
                            setWorkForm({ ...workForm, assignedUsers: selectedValues });
                          }
                        }}
                      >
                        <option value="all">Select All</option>
                        {users.students.map((student) => (
                          <option key={student.id} value={student.id}>{student.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                }

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

                <div className="form-actions">
                  <button type="submit" className="submit-button">Create Assignment</button>
                  <button className="cancel-button" onClick={() => {
                    setMaterialType('')
                    setShowWorkForm(false)
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </>}

      {<div className="work-list">
        {[...publishedAssignments].map((assignment, index) => (
          <div key={assignment.id || index} className="assignment-card">
            <h3>{assignment.title}</h3>
            <p>{assignment.description}</p>

            {assignment.attachments?.length > 0 && (
              <div className="assignment-attachments">
                <span className="attachment-icon">📎</span>
                <span>{assignment.attachments.length} attachments</span>
              </div>
            )}

            {assignment.type === "practice" && (
              <div className="assignment-footer">
                <span>Due: {new Date(assignment.dueDate).toLocaleString()}</span>
                <span>{assignment.points} points</span>
               {role === "Teachet" ? 
               <></> : 
               <button className="view-button" onClick={() => navigate(`/assignment/${assignment._id}`)}>View Assignment</button>} 
              </div>)}
          </div>
        ))}
      </div>}
    </div>
  )
}

export default Classwork