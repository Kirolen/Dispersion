import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { gradeTask } from "../../../api/materialService";

import styles from "./GradeAssignmentForm.module.css";
import { setFeedback, setGrade, setStatus } from "../../../store/reducers/assignmentSlice";
import { getFileIcon } from "../../../utils/fileUtils";

const GradeAssignmentForm = () => {
    const dispatch = useDispatch();
    const { assignmentId } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const refId = searchParams.get("ref");
    const { assignment, attachments, feedback, grade } = useSelector((state) => state.assignment);
    const { user_id } = useSelector((state) => state.user);
    const [localGrade, setLocalGrade] = useState(grade);
    const [localFeedback, setLocalFeedback] = useState("");
    
    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await gradeTask(assignmentId, refId, user_id, localGrade, feedback);
            dispatch(setStatus(response.status))
            dispatch(setGrade(localGrade));
            dispatch(setFeedback(localFeedback || ""))
        } catch (error) {
            console.error("Error grading assignment:", error);
        }
    };

    if (!assignment) {
        return <div className="not-found">Assignment not found</div>;
    }

    return (
        <div className={styles.gradeContent}>
            <h2 className={styles.gradeLabel}>Оцінити завдання</h2>
            <h2 className={styles.label}>Прикріплені файли студента:</h2>
            {attachments.length > 0 ? (
                <div className={styles.studentAttachments}>
                    {attachments.map((file, index) => (
                        <div className={styles.attachmentItem} key={index}>
                            <span className={styles.icon}>{getFileIcon(file.filename)}</span>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                                {file.filename}
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Немає прикріплених файлів.</p>
            )}
            <form onSubmit={handleGradeSubmit}>
                <div className={styles.grade}>
                    <h2 className={styles.label}>Grade:</h2>
                    <label htmlFor="gradeInput">Grade (out of {assignment.points}): </label>
                    <input
                        id="gradeInput"
                        type="number"
                        value={localGrade}
                        onChange={(e) => setLocalGrade(e.target.value)}
                        max={assignment.points}
                        min="0"
                        step="0.01"
                    />
                </div>
                <div className={styles.feedback}>                    
                    <h2 className={styles.label}>Feedback:</h2>
                    <p className={styles.feedbackText}>{feedback?.trim().length > 0 ? feedback : "Provide feedback..."}</p>
                    <textarea
                        id="feedbackInput"
                        value={localFeedback}
                        onChange={(e) => setLocalFeedback(e.target.value)}
                        placeholder="Provide feedback..."
                    />
                </div>
                <button type="submit">Submit Grade</button>
            </form>
        </div>
    );
};

export default GradeAssignmentForm;
