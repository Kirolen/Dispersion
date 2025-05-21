import styles from "./AssignmentCreationForm.module.css";
import { GoPaperclip } from "react-icons/go";

import { AiFillDelete } from "react-icons/ai";
import { getFileIcon } from '../../../utils/fileUtils';

const MaterialForm = ({ setImageForRemoving, assignmentForm, updateAssignmentFormField }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateAssignmentFormField(name, value)
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        updateAssignmentFormField("attachments", [...assignmentForm.attachments, ...files])
    };

    const handleFileRemove = (index) => {
        const fileToRemove = assignmentForm.attachments[index];

        if (!(fileToRemove instanceof File) && fileToRemove.url) {
            setImageForRemoving(prev => ([...prev, fileToRemove.url]))
        }
        updateAssignmentFormField("attachments", assignmentForm.attachments.filter((_, i) => i !== index))
    };

    return (
        <>
            <input
                type="text"
                name="title"
                className={styles.textInput}
                placeholder="Title (required)"
                value={assignmentForm.title}
                onChange={handleChange}
                required
            />
            <textarea
                name="description"
                placeholder="Description"
                value={assignmentForm.description}
                onChange={handleChange}
            />

            <div className={styles.fileUploadGroup}>
                <label className={styles.fileInputLabel}>
                    <p>Choose file</p>
                    <input
                        type="file"
                        id="fileUpload"
                        className={styles.fileInput}
                        multiple
                        onChange={handleFileChange}
                    />
                    <GoPaperclip className={styles.paperclipIcon} />
                </label>
            </div>

            {assignmentForm.attachments.length > 0 && (
                <div className={styles.fileList}>
                    {assignmentForm.attachments.map((file, index) => (
                        <div key={index} className={styles.fileItem}>
                            {getFileIcon(file.filename || file.name)}
                            <a href={file.url} target="_blank" rel="noopener noreferrer">{file.filename || file.name}</a>
                            <AiFillDelete
                                className={styles.removeFileButton}
                                onClick={() => handleFileRemove(index)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>

    );
};

export default MaterialForm;
