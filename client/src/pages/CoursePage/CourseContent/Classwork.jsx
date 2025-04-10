import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCoursePeople } from '../../../api/courseService';
import { useNavigate } from 'react-router-dom';
import { addTask, getAllCourseMaterials, getCourseMaterialsForStudent } from '../../../api/materialService'
import { uploadFiles, deleteFile } from "../../../api/fileService";
import { useSelector } from 'react-redux';

const Classwork = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [materialType, setMaterialType] = useState("")
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [publishedAssignments, setPublishedAssignments] = useState([]);
  const [users, setUsers] = useState(null);
  const { user_id, role } = useSelector((state) => state.user);

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
          assignments = await getAllCourseMaterials(courseId);
        }
        else {
          assignments = await getCourseMaterialsForStudent(courseId, user_id);
        }
        console.log(assignments)
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
      console.log(workForm.title,
        workForm.description,
        materialType,
        dueDateTime,
        workForm.points,
        courseId,
        workForm.assignedUsers,
        workForm.attachments)

      await addTask(
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

      const updatedAssignments = await getAllCourseMaterials(courseId);
      setPublishedAssignments(updatedAssignments);
    } catch (error) {
      console.error('Error adding material:', error);
    }
  };

  const handleFileChange = async (e) => {
    const newFile = Array.from(e.target.files);
    const response = await uploadFiles(newFile, "assignments")
    const file = {
      filename: response[0]?.filename,
      url: response[0]?.url,
      type: response[0]?.type
    }

    const newAttachments = [...workForm.attachments, file]

    setWorkForm(prev => ({
      ...prev,
      attachments: newAttachments
    }));
  };

  const removeAttachment = async (indexToRemove) => {

    const fileToDelete = workForm.attachments[indexToRemove];
    console.log(fileToDelete)
    if (!fileToDelete || !fileToDelete.url) {
      console.error("❌ Помилка: URL файлу не знайдено");
      return;
    }

    await deleteFile(null, fileToDelete.url);
    const newAttachments = workForm.attachments.filter((_, index) => index !== indexToRemove)

    setWorkForm(prev => ({
      ...prev,
      attachments: newAttachments
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
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.filename}
                    </a>
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
                    setWorkForm({
                      title: '',
                      description: '',
                      dueDate: '',
                      dueTime: '',
                      points: 100,
                      attachments: [],
                      assignedUsers: [],
                    });
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
                {role === "Teacher" ?
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