import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { submitSubmission, returnSubmission, updateStundetTask } from "../../../api/materialService";
import { uploadFiles, deleteFile } from "../../../api/fileService";
import { setAttachments, setStatus } from "../../../store/reducers/assignmentSlice";
import { getFileIcon } from "../../../utils/fileUtils";
import styles from "./SubmissionForm.module.css";


const SubmissionForm = () => {
    const { assignmentId } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const dispacth = useDispatch();
    const { assignment, attachments, status } = useSelector((state) => state.assignment)
    const { user_id } = useSelector((state) => state.user);


    const handleFileChange = async (e) => {
        const newFile = Array.from(e.target.files);
        const response = await uploadFiles(newFile, "assignments")
        const file = {
            filename: response[0]?.filename,
            url: response[0]?.url,
            type: response[0]?.type
        }

        const newAttachments = [...attachments, file]
        dispacth(setAttachments(newAttachments))
        await updateStundetTask(assignmentId, user_id, newAttachments)

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
        dispacth(setAttachments(newAttachments))
    };

    const handleSubmitAssignment = async () => {
        try {
            const response = await submitSubmission(assignmentId, user_id);
            dispacth(setStatus(response?.status || "not_passed"))
        } catch (error) {
            console.error("Error submitting assignment:", error);
            alert("Сталася помилка під час подання завдання.");
        }
    };

    const handleReturnAssignment = async () => {
        try {
            const response = await returnSubmission(assignmentId, user_id)
            dispacth(setAttachments(response.attachments))
            dispacth(setStatus("not_passed"))
        } catch (error) {
            console.error("Error submitting assignment:", error);
            alert("Сталася помилка під час поверення завдання.");
        }
    };

    return (
        <div className={styles.submissionForm}>
            <h2>{status === "submitted" ? "Ваше подання" : "Подати завдання"}</h2>

            <h3>Attachments</h3>
            {status === "not_passed" &&
                <input type="file" multiple onChange={handleFileChange} className="file-input" />
            }
            {attachments.length > 0 && (
                <div className={styles.attachments}>
                    {attachments.map((file, index) => (
                        <div key={index} className={styles.attachmentItem}>
                            <span className={styles.icon}>{getFileIcon(file.filename)}</span>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">
                                {file.filename}
                            </a>
                            {status === "not_passed" && (
                                <button className={styles.removeAttachment} type="button" onClick={() => removeAttachment(index)}>×</button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {status === "graded" && (
                <div className={styles.feedback}>
                    <h3>Відгук:</h3>
                    <h3>{assignment.userDetails.response?.name || "Відгук ще не надано."}</h3>
                    <p>{assignment.userDetails.response?.message || "Відгук ще не надано."}</p>
                </div>
            )}

            {status === "not_passed" && (
                <button onClick={handleSubmitAssignment} className={styles.submitAssignment}>
                    Submit Assignment
                </button>
            )}

            {(status === "passed_in_time" || status === "passed_with_lateness" || status === "graded") && (
                <button onClick={handleReturnAssignment} className={styles.returnAssignment}>
                    Return Assignment
                </button>
            )}

        </div>
    );
};

export default SubmissionForm;
