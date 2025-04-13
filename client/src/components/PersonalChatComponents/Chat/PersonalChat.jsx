import React, { useEffect, useState, useRef } from "react";
import styles from "./PersonalChat.module.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { MdEmojiEmotions } from "react-icons/md";
import { GoPaperclip } from "react-icons/go";
import { FaImage, FaFile, FaVideo, FaMusic } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { getChat, markLastMessageAsRead } from "../../../api/personalChatService";
import { useSocket } from "../../../context/SocketContext";
import { uploadFiles } from "../../../api/fileService";
import { useSelector, useDispatch } from "react-redux";
import { setNotification } from "../../../store/reducers/userSlice";
import { addMessage, setMessages, setChatId, setChatDetailsActive } from '../../../store/reducers/personalChatSlice';
import MessageAttachmentsPrewiev from "../../MessageAttachmentsPrewiev/MessageAttachmentsPrewiev"
import MessageAttachments from "../../MessageAttachments/MessageAttachments";

const PersonalChat = () => {
    const dispatch = useDispatch();
    const [member, setMember] = useState([]);
    const [open, setOpen] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [text, setText] = useState("");
    const [attachments, setAttachments] = useState([]);
    const { user_id, notification } = useSelector((state) => state.user)
    const { chatDetailsActive, chatId, messages } = useSelector((state) => state.chat)
    const { socket } = useSocket();
    const isMenuOpen = useSelector(state => state.menu.isMenuOpen);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                if (!socket || !chatId.trim() || chatId === "-1") {
                    return;
                }
                socket.emit("joinChat", { chatId, user_id, course_id: null });
                socket.off("getMessages");
                socket.off("newMessage");

                socket.on("getMessages", (loadedMessages) => {
                    dispatch(setMessages(loadedMessages));

                    const updatedNotifications = notification.unreadChats.filter(id => id !== chatId);
                    dispatch(setNotification({
                        ...notification,
                        unreadChats: updatedNotifications
                    }));
                });

                socket.on("newMessage", (newMessage) => {
                    if (newMessage.chatId === chatId) {
                        dispatch(addMessage(newMessage))
                    }
                });

                const response = await getChat(chatId);
                const chat = response.data.chat;

                if (chat && chat.members && chat.members.length >= 2) {
                    const [member1, member2] = chat.members;
                    setMember(member1._id === user_id ? member2 : member1);
                }
            } catch (error) {
                console.error("Error fetching chat:", error);
            }
        };

        fetchMessages();

        return () => {
            if (socket?.emit) {
                socket.emit("leaveChat", { chatId });
            }

            socket?.off("getMessages");
            socket?.off("newMessage");
        };
        //eslint-disable-next-line
    }, [socket, chatId, setNotification, user_id]);

    useEffect(() => {
        if (chatId === "-1" || !chatId.trim() || user_id.toString() === "-1" || messages.length === 0) return;
        const markMessagesAsRead = async () => {
            await markLastMessageAsRead(chatId, user_id, null);
        };

        markMessagesAsRead();
    }, [messages, chatId, user_id]);

    const handleAttachmentClick = (type) => {
        if (attachments.length >= 5) {
            alert("Maximum 5 files allowed per message");
            return;
        }

        const acceptedTypes = {
            image: "image/*",
            video: "video/*",
            audio: "audio/*",
            file: "*/*"
        };

        fileInputRef.current.accept = acceptedTypes[type];
        fileInputRef.current.click();
        setShowAttachMenu(false);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (attachments.length + files.length > 5) {
            alert("Maximum 5 files allowed per message");
            return;
        }

        const newAttachments = files.map(file => {
            const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
            const type = file.type;

            return {
                file,
                preview,
                type,
                name: file.name,
                url: preview || URL.createObjectURL(file)
            };
        });

        setAttachments(prev => [...prev, ...newAttachments]);
        e.target.value = '';
    };

    const handleSendMessage = async () => {
        try {
            if (socket && (text.trim() || attachments.length > 0) && chatId.trim()) {
                const files = attachments.map(att => att.file);

                let uploadedFiles = null;
                if (files.length > 0) uploadedFiles = await uploadFiles(files, "chats");

                socket.emit("sendMessage", {
                    chatId,
                    sender: user_id,
                    text,
                    attachments: uploadedFiles
                });
                setText("");
                setAttachments([]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleEmoji = (e) => {
        setText(prev => prev + e.emoji);
        setOpen(false);
    };

    return (
        <div className={`${styles.chat} ${isMenuOpen ? styles.withOpenMenu : ""} ${chatId.trim() ? styles.active : ''}`}>
            <div className={styles.chatTop} onClick={() => dispatch(setChatDetailsActive(!chatDetailsActive))}>
                <AiOutlineArrowLeft className={styles.backButton} onClick={(event) => {
                    event.stopPropagation();
                    dispatch(setChatId(""));
                    dispatch(setChatDetailsActive(false));
                }} />

                <div className={styles.anotherUserInfo}>
                    <img
                        src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg"
                        alt="avatar"
                    />
                    <span>{member.first_name} {member.last_name}</span>
                </div>
            </div>
            <div className={styles.chatCenter}>
                {messages?.map((message) => (
                    <div key={message.id} className={`${styles.message} ${message.sender._id === user_id ? styles.own : ""}`}>
                        {message.sender._id !== user_id && (
                            <img
                                src="https://i.pinimg.com/736x/5e/32/aa/5e32aa2c79cd463ab74e034aaace4eb1.jpg"
                                alt="avatar"
                                className={styles.anotherUserChatAvatar}
                            />
                        )}
                        <div className={styles.messageText}>
                            <MessageAttachments attachments={message.attachments} />
                            {message.text && <p>{message.text}</p>}
                            <span>{message.created_at}</span>
                        </div>
                    </div>
                ))}
            </div>
            {attachments.length > 0 && <MessageAttachmentsPrewiev attachments={attachments} setAttachments={setAttachments} />}
            <div className={styles.chatBottom}>
                <div className={styles.attachmentsControl}>
                    <GoPaperclip
                        className="icon"
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                    />
                    {showAttachMenu && (
                        <div className={styles.attachmentsMenu}>
                            <div className={styles.attachmentOption} onClick={() => handleAttachmentClick('image')}>
                                <FaImage />
                                <span>Image</span>
                            </div>
                            <div className={styles.attachmentOption} onClick={() => handleAttachmentClick('video')}>
                                <FaVideo />
                                <span>Video</span>
                            </div>
                            <div className={styles.attachmentOption} onClick={() => handleAttachmentClick('audio')}>
                                <FaMusic />
                                <span>Audio</span>
                            </div>
                            <div className={styles.attachmentOption} onClick={() => handleAttachmentClick('file')}>
                                <FaFile />
                                <span>File</span>
                            </div>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        multiple
                    />
                </div>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <div className={styles.emojiContainer}>
                    <MdEmojiEmotions className={styles.icon} onClick={() => setOpen(!open)} />
                    {open && (
                        <EmojiPicker onEmojiClick={handleEmoji} className={styles.emojiPicker} />
                    )}
                </div>

                <button className={styles.sendMessageButton} onClick={handleSendMessage}>Send</button>
            </div>
        </div>

    );
};

export default PersonalChat;