import React from "react";
import styles from "./AttachmentType.module.css";
import { AiOutlineDownload } from "react-icons/ai";
import { getFileIcon } from "../../utils/fileUtils";

const AttachmentType = ({ attachment, openImageModal, fileSizeClass, itemClass }) => {
    const { type, url, preview, filename } = attachment;

    if (type.startsWith("image/")) {
        return (
            <div className={styles[itemClass]}>
                <img
                    src={url || preview}
                    alt="attachment"
                    className={`${styles.messageMedia} ${styles[fileSizeClass]}`}
                    onClick={() => openImageModal(url || preview)}
                />
            </div>
        );
    }

    if (type.startsWith("video/")) {
        return (
            <div className={`${styles.file} ${styles[fileSizeClass]}`}>
                <video controls className={styles.messageMedia}>
                    <source src={url} type={type} />
                    Your browser does not support video playback.
                </video>
            </div>
        );
    }

    if (type.startsWith("audio/")) {
        return (
            <div className={`${styles.file} ${styles[fileSizeClass]}`}>
                <audio controls>
                    <source src={url} type={type} />
                </audio>
            </div>
        );
    }

    return (
        <div className={`${styles.file} ${styles[fileSizeClass]}`}>
            {getFileIcon(filename)}
            <span>{filename}</span>
            <a href={url} download>
                <AiOutlineDownload className={styles.icon} />
            </a>
        </div>
    )
};

export default AttachmentType;