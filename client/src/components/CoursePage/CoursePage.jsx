import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import './CoursePage.css';

import {mockCourses} from "../../mockData/mockData"

const CoursePage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stream');
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [localAnnouncements, setLocalAnnouncements] = useState([]);
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
        //const response = await api.get(`/courses/${courseId}`);
        //setCourse(response.data);
        setCourse(mockCourses()[0])
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleAnnouncementSubmit = () => {
    if (!announcement.trim()) return;

    const newAnnouncement = {
      id: Date.now(),
      content: announcement,
      author: 'Current User',
      date: new Date().toLocaleString()
    };

    setLocalAnnouncements([newAnnouncement, ...localAnnouncements]);
    setAnnouncement('');
  };

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
          onClick={() => setActiveTab('stream')}
        >
          Stream
        </button>
        <button
          className={`tab ${activeTab === 'classwork' ? 'active' : ''}`}
          onClick={() => setActiveTab('classwork')}
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
        {activeTab === 'stream' && (
          <div className="stream-section">
            <div className="announcement-box">
              <input
                type="text"
                placeholder="Share something with your class..."
                className="announcement-input"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
              />
              <button className="post-button" onClick={handleAnnouncementSubmit}>Post</button>
            </div>
            <div className="stream-feed">
              {[...localAnnouncements, ...(course.announcements || [])].map((announcement, index) => (
                <div key={announcement.id || index} className="announcement-card">
                  <div className="announcement-header">
                    <span className="author">{announcement.author}</span>
                    <span className="date">{announcement.date}</span>
                  </div>
                  <p className="announcement-content">{announcement.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'classwork' && (
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
                      <button type="button" className="add-test-button" >
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
              {[...localAssignments, ...(course.assignments || [])].map((assignment, index) => (
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
        )}

        {activeTab === 'people' && (
          <div className="people-section">
            <div className="teachers-list">
              <h2>Teachers</h2>
              <div className="person-card">
                <span className="person-name">{course.teacher_name}</span>
                <span className="person-email">{course.teacher_email}</span>
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
            {course.grades?.length > 0 ? (
              <table className="grades-table">
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Due Date</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {course.grades.map((grade, index) => (
                    <tr key={index}>
                      <td>{grade.assignment}</td>
                      <td>{grade.dueDate}</td>
                      <td>{grade.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-content">No grades available yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;