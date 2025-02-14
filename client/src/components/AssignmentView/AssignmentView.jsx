import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getStudentTaskInfo, submitSubmission, gradeTask, returnSubmission, updateStundetTask } from "../../api/materialService";
import { uploadFiles, deleteFile } from "../../api/fileService";
import "./AssignmentView.css";

const AssignmentView = ({ user_id, role }) => {
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const refId = searchParams.get("ref");
  const [assignment, setAssignment] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState("");
  const [status, setStatus] = useState("not_passed");

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        if (!user_id || (!refId && (role === "Teacher"))) return;
        const studentID = (role === "Teacher") ? refId : user_id
        const response = await getStudentTaskInfo(assignmentId, studentID);
        const assignmentData = response.data;
        console.log(assignmentData)
        setAssignment(assignmentData);
        setAttachments(assignmentData.userDetails.attachments)
        console.log(assignmentData.userDetails?.status)
        setStatus(assignmentData.userDetails?.status || "not_passed");
      } catch (error) {
        console.error("Error fetching assignment details:", error);
      }
    };

    fetchAssignmentDetails();
  }, [assignmentId, user_id]);

  const handleFileChange = async (e) => {
    const newFile = Array.from(e.target.files);
    const response = await uploadFiles(newFile, "assignments")
    const file = {
      filename: response[0]?.filename,
      url: response[0]?.url,
      type: response[0]?.type
    }

    const newAttachments = [...attachments, file]

    await updateStundetTask(assignmentId, user_id, newAttachments)
    setAttachments((prevFiles) => [...prevFiles, file]);
    e.target.value = "";
  };

  const removeAttachment = async (indexToRemove) => {
    const fileToDelete = attachments[indexToRemove];

    if (!fileToDelete || !fileToDelete.url) {
      console.error("❌ Помилка: URL файлу не знайдено");
      return;
    }

    await deleteFile(assignmentId, fileToDelete.url);
    const newAttachments = attachments.filter((_, index) => index !== indexToRemove)
    await updateStundetTask(assignmentId, user_id, newAttachments)
    setAttachments(newAttachments)
  };

  const handleSubmitAssignment = async () => {
    try {

      const response = await submitSubmission(assignmentId, user_id);
      setStatus(response.status);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Сталася помилка під час подання завдання.");
    }
  };

  const handleReturnAssignment = async () => {
    try {
      const response = await returnSubmission(assignmentId, user_id)
      console.log(response.attachments)
      setAttachments(response.attachments)
      setStatus("not_passed");
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Сталася помилка під час поверення завдання.");
    }

  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await gradeTask(assignmentId, refId, user_id, grade, feedback)
      navigate(`/course/${assignment.course_id}/grades`)
    } catch (error) {
      console.error("Error grading assignment:", error);
      alert("Сталася помилка під час оцінювання завдання.");
    }
  };

  if (!assignment) {
    return <div className="not-found">Assignment not found</div>;
  }

  return (
    <div className="assignment-view">
      <header className="assignment-view-header">
        <h1>{assignment.title}</h1>
        <button onClick={() => navigate(-1)} className="back-button"> Back to Assignments </button>
      </header>

      <div className="assignment-view-content">
        <section className="assignment-details">
          <h2>Assignment Details</h2>
          <p className="description">{assignment.description}</p>
          <div className="meta-info">
            <span>
              Due Date:{" "}
              {new Date(assignment.dueDate).toLocaleString("en-GB", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZone: "UTC",
              })}
            </span>
            <span>Points: {assignment.userDetails.grade} / {assignment.points}</span>
            <span>Status: {status}</span>
          </div>
          {assignment.attachments.length > 0 && <div className="material">
            <div className="attachments-preview">
               <h2>Прикріплені файли</h2>
                {assignment.attachments.map((file, index) => (
                  <div key={index} className="attachment-item">
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.filename}
                    </a>
                  </div>
                ))}
              </div>
          </div>}
        </section>

        {role === "Student" && (
          <section className="submission-section">
            <h2>{status === "submitted" ? "Ваше подання" : "Подати завдання"}</h2>

            <label htmlFor="fileInput">Attachments</label>
            {status === "not_passed" &&
            <input id="fileInput" type="file" multiple onChange={handleFileChange} className="file-input" />
            }
            {attachments.length > 0 && (
              <div className="attachments-preview">
                {attachments.map((file, index) => (
                  <div key={index} className="attachment-item">
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.filename}
                    </a>
                    {status === "not_passed" && (
                      <button type="button" onClick={() => removeAttachment(index)}>×</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {status === "not_passed" && (
              <button onClick={handleSubmitAssignment} className="submit-button">
                Submit Assignment
              </button>
            )}

            {(status === "passed_in_time" || status ==="passed_with_lateness" || status==="graded") && (
              <button onClick={handleReturnAssignment} className="return-button">
                Return Assignment
              </button>
            )}

            {status === "graded" && (
              <div className="feedback-section">
                <h3>Відгук:</h3>
                <h3>{assignment.userDetails.response?.name || "Відгук ще не надано."}</h3>
                <p>{assignment.userDetails.response?.message || "Відгук ще не надано."}</p>
              </div>
            )}
          </section>
        )}

        {role === "Teacher" && (
          <section className="grading-section">
            <h2>Оцінити завдання</h2>
            <h3>Прикріплені файли студента:</h3>
            {attachments.length > 0 ? (
              <div className="attachments-preview">
                {attachments.map((file, index) => (
                  <div key={index} className="attachment-item">
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.filename}
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p>Немає прикріплених файлів.</p>
            )}
            <form onSubmit={handleGradeSubmit} className="grade-form">
              <div className="form-group">
                <label htmlFor="gradeInput">Grade (out of {assignment.points})</label>
                <input id="gradeInput" type="number" value={grade} onChange={(e) => setGrade(e.target.value)} max={assignment.points} min="0" />
              </div>
              <div className="form-group">
                <label htmlFor="feedbackInput">Feedback</label>
                <textarea id="feedbackInput" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Provide feedback..." />
              </div>
              <button type="submit" className="submit-grade">Submit Grade</button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default AssignmentView;
