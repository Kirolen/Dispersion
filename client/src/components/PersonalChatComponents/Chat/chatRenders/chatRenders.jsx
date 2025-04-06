
import { FaFile } from "react-icons/fa";
import styles from '../PersonalChat.module.css'

import { AiOutlineDownload } from "react-icons/ai";
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

export const renderAttachment = (attachment, openImageModal) => {
    const { type, url, preview, filename } = attachment;

    if (type.startsWith("image/")) {
        return (
            <img
                src={url || preview}
                alt="attachment"
                className={styles.messageMedia}
                onClick={() => openImageModal(url || preview)}
            />
        );
    }

    if (type.startsWith("video/")) {
        return (
            <video controls className={styles.messageMedia}>
                <source src={url} type={type} />
                Your browser does not support video playback.
            </video>
        );
    }

    if (type.startsWith("audio/")) {
        return (
            <>
                <audio controls>
                    <source src={url} type={type} />
                </audio>
            </>
        );
    }

    return (
        <>
            <FaFile className={styles.icon} />
            <span>{filename}</span>
            <a href={url} download>
                <AiOutlineDownload className={styles.icon}/>
            </a>
        </>
    );
};


export const renderAttachmentsPrewiev = (attachments, setAttachments) => {
    return (
        <div className={styles.attachmentsPrewiev}>
            {attachments.map((att, index) => (
                <div key={index} className={styles.attachmentPrewievItem}>
                    {att.type.includes("image") ? (
                        <img src={att.preview} alt={`Preview ${index}`} />
                    ) : (
                        <div className={styles.fileItem}>
                            <FaFile />
                            <span>{att.name}</span>
                        </div>
                    )}
                    <button onClick={() => removeAttachment(index, setAttachments)} className={styles.removeAttachment}>×</button>
                </div>
            ))}
        </div>
    )
}

export const renderMessage = (message, openImageModal, user_id) => {
    const images = message.attachments?.filter(att => att.type.startsWith("image/")) || [];
    const filesAndAudio = message.attachments?.filter(att => !att.type.startsWith("image/")) || [];

    return (
        <div key={message.id} className={`${styles.message} ${message.sender._id === user_id ? styles.own : ""}`}>
            {message.sender._id !== user_id && (
                <img
                    src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg"
                    alt="avatar"
                    className={styles.anotherUserChatAvatar}
                />
            )}
            <div className={styles.messageText}>
                {images.length > 0 && (
                    <div className={styles.mediaAttachmentContainer}>
                        {images.map((attachment, index) => (
                            <div key={index} className={styles.messageMedia}>
                                {renderAttachment(attachment, openImageModal)}
                            </div>
                        ))}
                    </div>
                )}

                {filesAndAudio.length > 0 && (
                    <div className={styles.filesAttachmentContainer}>
                        {filesAndAudio.map((attachment, index) => (
                            <div key={index} className={styles.messageFile}>
                                {renderAttachment(attachment, openImageModal)}
                            </div>
                        ))}
                    </div>
                )}

                {message.text && <p>{message.text}</p>}
                <span>{message.created_at}</span>
            </div>
        </div>
    );
};
