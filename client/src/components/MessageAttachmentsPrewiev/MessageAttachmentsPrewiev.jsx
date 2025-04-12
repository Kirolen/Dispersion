import React from 'react';
import styles from './MessageAttachmentsPrewiev.module.css'
import { getFileIcon } from '../../utils/fileUtils';

const MessageAttachmentsPrewiev = ({ attachments, setAttachments }) => {
    const removeAttachment = (index, setAttachments) => {
        setAttachments(prev => {
            const newAttachments = [...prev];
            if (newAttachments[index].preview) {
                URL.revokeObjectURL(newAttachments[index].preview);
            }
            newAttachments.splice(index, 1);
            return newAttachments;
        });
    };


    return (
        <div className={styles.attachmentsPrewiev}>
            {attachments.map((att, index) => (
                <div key={index} className={styles.attachmentPrewievItem}>
                    {att.type.includes("image") ? (
                        <img src={att.preview} alt={`Preview ${index}`} />
                    ) : (
                        <div className={styles.fileItem}>
                            {getFileIcon(att.name)}
                            <span>{att.name}</span>
                        </div>
                    )}
                    <button onClick={() => removeAttachment(index, setAttachments)} className={styles.removeAttachment}>×</button>
                </div>
            ))}
        </div>
    )
};

export default MessageAttachmentsPrewiev;
