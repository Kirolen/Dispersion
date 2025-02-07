import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getStudentTaskInfo, handInTask, gradeTask } from "../../api/materialService";
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
        setStatus(assignmentData.userDetails?.status || "not_passed");
      } catch (error) {
        console.error("Error fetching assignment details:", error);
      }
    };

    fetchAssignmentDetails();
  }, [assignmentId, user_id]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setAttachments((prevFiles) => [...prevFiles, ...newFiles]);
    e.target.value = "";
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmitAssignment = async () => {
    try {
      const response = await handInTask(assignmentId, user_id, attachments, "send");
      setStatus("submitted");
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Сталася помилка під час подання завдання.");
    }
  };

  const handleReturnAssignment = async () => {
    try {
      const response = await handInTask(assignmentId, user_id, attachments, "return");
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
        <button onClick={() => navigate(-1)} className="back-button">
          Back to Assignments
        </button>
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
        </section>

        {role === "Student" && (
          <section className="submission-section">
            <h2>
              {status === "submitted" ? "Ваше подання" : "Подати завдання"}
            </h2>

            {status === "not_passed" ? (
              <>
                <label htmlFor="fileInput">Attachments</label>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="file-input"
                />
                {attachments.length > 0 && (
                  <div className="attachments-preview">
                    {attachments.map((file, index) => (
                      <div key={index} className="attachment-item">
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={handleSubmitAssignment}
                  className="submit-button"
                >
                  Submit Assignment
                </button>
              </>
            ) : (
              <>
                {status === "graded" ? (
                  <div className="feedback-section">
                    <h3>Відгук:</h3>
                    <h3>{assignment.userDetails.response.name || "Відгук ще не надано."}</h3>
                    <p>{assignment.userDetails.response.message || "Відгук ще не надано."}</p>
                  </div>
                ) : (
                  <></>
                )}
                <button
                    onClick={handleReturnAssignment}
                    className="return-button"
                  >
                    Return Assignment
                  </button>
              </>
            )}
          </section>
        )}


        {role === "Teacher" && (
          <section className="grading-section">
            <h2>Оцінити завдання</h2>
            <form onSubmit={handleGradeSubmit} className="grade-form">
              <div className="form-group">
                <label htmlFor="gradeInput">
                  Grade (out of {assignment.points})
                </label>
                <input
                  id="gradeInput"
                  type="number"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  max={assignment.points}
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="feedbackInput">Feedback</label>
                <textarea
                  id="feedbackInput"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback..."
                />
              </div>
              <button onClick={handleGradeSubmit} className="submit-grade">
                Submit Grade
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default AssignmentView;
