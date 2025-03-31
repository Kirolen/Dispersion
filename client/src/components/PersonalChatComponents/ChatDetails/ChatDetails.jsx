import "./ChatDetails.css";
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineDownload } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import { useSocket } from "../../../context/SocketContext";
import { useState, useEffect } from "react";

const ChatDetails = ({ setShowDetails, showDetails, messages }) => {
    const { isCollapsed } = useSocket();
    const [attachments, setAttachments] = useState({ files: [], media: [] });

    useEffect(() => {
        const getAttachments = () => {
            let files = [];
            let media = [];

            messages.forEach((message) => {
                if (message.attachments && message.attachments.length > 0) {
                    message.attachments.forEach((att) => {
                        if (att.type.startsWith("image")) {
                            media.push(att);
                        } else {
                            files.push(att);
                        }
                    });
                }
            });

            return { files, media };
        };

        setAttachments(getAttachments());
    }, [messages]);

    return (
        <div className={`chat-details ${isCollapsed ? '' : 'not-collapsed'} ${showDetails ? "active" : ""}`}>
            <button className="back-button" onClick={() => setShowDetails(false)}>
                <FaArrowLeft />
            </button>
            <div className="user">
                <img src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg" alt="ayase" className="user-chat-avatar" />
                <h2>Ayase Momo</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            </div>
            <div className="info">
                {/* Shared Photos */}
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <AiOutlineArrowDown className="icon" />
                    </div>
                    <div className="photos">
                        {attachments.media.map((photo, index) => (
                            <div className="photo-item" key={index}>
                                <div className="photo-detail">
                                    <img src={photo.url || photo.preview} alt={`photo-${index}`} />
                                    <span>{photo.filename || "Photo"}</span>
                                </div>
                                <a href={photo.url} download>
                                    <AiOutlineDownload className="icon" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shared Files */}
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <AiOutlineArrowUp className="icon" />
                    </div>
                    <div className="files">
                        {attachments.files.map((file, index) => (
                            <div className="file-item" key={index}>
                                <div className="file-detail">
                                    <span>{file.filename || "File"}</span>
                                </div>
                                <a href={file.url} download>
                                    <AiOutlineDownload className="icon" />
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