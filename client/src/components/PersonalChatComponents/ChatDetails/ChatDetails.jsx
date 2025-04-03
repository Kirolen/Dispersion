import styles from "./ChatDetails.module.css";
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineDownload } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useSocket } from "../../../context/SocketContext";

const ChatDetails = ({ messages }) => {
    const [attachments, setAttachments] = useState({ files: [], media: [] });
    const { chatDetailsActive, isMenuOpen } = useSocket();
    
    useEffect(() => {
        const files = [];
        const media = [];

        messages.forEach(({ attachments }) => {
            attachments?.forEach((att) => {
                att.type.startsWith("image") ? media.push(att) : files.push(att);
            });
        });

        setAttachments({ files, media });
    }, [messages]);

    return (
        <div className={`${styles.chatDetails} ${chatDetailsActive ? styles.active : ""} ${isMenuOpen ? styles.withOpenMenu : ""}`}>
            <div className={styles.anotherUserInfo}>
                <img src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg" alt="ayase"/>
                <h2>Ayase Momo</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            </div>

            <div className={styles.shared}>
                <div className={styles.option}>
                    <div className={styles.title}>
                        <span>Shared Photos</span>
                        <AiOutlineArrowDown className={styles.icon} />
                    </div>
                    <div className={styles.media}>
                        {attachments.media.map(({ url, preview, filename }, index) => (
                            <div className={styles.mediaItem} key={index}>
                                <div className={styles.mediaDetail}>
                                    <img src={url || preview} alt={`photo-${index}`} />
                                    <span>{filename || "Photo"}</span>
                                </div>
                                <a href={url} download>
                                    <AiOutlineDownload className={styles.icon} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.option}>
                    <div className={styles.title}>
                        <span>Shared Files</span>
                        <AiOutlineArrowUp className={styles.icon} />
                    </div>
                    <div className={styles.files}>
                        {attachments.files.map(({ url, filename }, index) => (
                            <div className={styles.fileItem} key={index}>
                                <div className={styles.fileDetail}>
                                    <span>{filename || "File"}</span>
                                </div>
                                <a href={url} download>
                                    <AiOutlineDownload className={styles.icon} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatDetails;
