import React, { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getStudentTaskInfo } from "../../api/materialService";
import { getFileIcon } from "../../utils/fileUtils";
import { setAssignment, setAttachments, setStatus, setFeedback, setGrade } from "../../store/reducers/assignmentSlice";
import styles from "./AssignmentView.module.css";

import GradeAssignmentForm from "./GradeAssignmentForm/GradeAssignmentForm";
import SubmissionForm from "./SubmissionForm/SubmissionForm";

const AssignmentView = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const refId = searchParams.get("ref");
  const dispacth = useDispatch();
  const { assignment, grade, status } = useSelector((state) => state.assignment)
  const { user_id, role } = useSelector((state) => state.user);


  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      if (assignmentId.toString() === "-1" || user_id.toString() === "-1" || (!refId && role === "Teacher")) return;

      try {
        const studentID = role === "Teacher" ? refId : user_id;
        const response = await getStudentTaskInfo(assignmentId, studentID);
        console.log(response)
        dispacth(setFeedback(response.userDetails?.response.message ?? ""))
        dispacth(setAssignment(response))
        dispacth(setAttachments(response.userDetails?.attachments || []))
        dispacth(setStatus(response.userDetails?.status || "not_passed"))
        dispacth(setGrade(response.userDetails?.grade ?? ""))
      } catch (error) {
        console.error("Error fetching assignment details:", error);
      }
    };

    fetchAssignmentDetails();
  }, [assignmentId, user_id, refId, role]);

  if (!assignment) {
    return <div className="not-found">Assignment not found</div>;
  }

  return (
    <div className={styles.assignmentContainer}>
      <div className={styles.assignmentHeader}>
        <h1>{assignment.title}</h1>
        <button className={styles.backButton} onClick={() => navigate(-1)}> Back to Assignments </button>
      </div>

      <div className={styles.assignmentContent}>
        <div className={styles.assignmentInfo}>
          <div className={styles.assignmentDetails}>
            <h2 className={styles.assignmentLabel}>Assignment Details</h2>
            <p className={styles.description}>
              <span className={styles.label}>Description: </span>
              {assignment.description}
            </p>
            {!assignment?.test?.isCompleted && role === "Student" && <p className={styles.testStart} onClick={() => navigate(`/test/attempt/${assignment._id}`)}>Start the test</p>}
            {assignment?.test?.isCompleted && role === "Student" && <p className={styles.testEnded}>Test ended</p>}
            {!assignment?.test?.isCompleted && role === "Teacher" && <p className={styles.testDontStarted}>Student dont pass the test</p>}
            {assignment?.test?.isCompleted && role === "Teacher" && <p className={styles.testViewAnswers} onClick={() => navigate(`/test/review/${assignment._id}/${refId}`)}>View answers</p>}
            {assignment.type !== "material" && <p className={styles.dueDate}>
              <span className={styles.label}>Due Date: </span>
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
            </p>}
            {assignment.type !== "material" && <p className={styles.points}>
              <span className={styles.label}>Points: </span>
              {grade} / {assignment.points}
            </p>}
            {assignment.type !== "material" && <p className={styles.status}>
              <span className={styles.label}>Status: </span>
              {status}
            </p>}
            {status === "graded" && (
              <div className={styles.feedback}>
                <h3>Відгук:</h3>
                <h3>{assignment.userDetails.response?.name || "Відгук ще не надано."}</h3>
                <p>{assignment.userDetails.response?.message || "Відгук ще не надано."}</p>
              </div>
            )}
          </div>
          {assignment.attachments.length > 0 && <div className={styles.assignmentAttachmentsContent}>
            <h2>Прикріплені файли</h2>
            <div className={styles.attachments}>
              {assignment.attachments.map((file, index) => (
                <div className={styles.attachmentItem} key={index}>
                  <span className={styles.icon}>{getFileIcon(file.filename)}</span>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.filename}
                  </a>
                </div>
              ))}
            </div>
          </div>}
        </div>

        {role === "Student" && assignment.type === "practice" && <SubmissionForm />}

        {role === "Teacher" && (<GradeAssignmentForm />)}
      </div>
    </div>
  );
};

export default AssignmentView;
