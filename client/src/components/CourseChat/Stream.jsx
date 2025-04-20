import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setNotification } from '../../store/reducers/userSlice';
import { markLastMessageAsRead } from '../../api/personalChatService'
import { useSocket } from '../../context/SocketContext';
import MessageAttachmentsPrewiev from '../MessageAttachmentsPrewiev/MessageAttachmentsPrewiev';
import { addMessageReverse, setMessages } from '../../store/reducers/personalChatSlice';
import { uploadFiles } from '../../api/fileService';
import CourseMessageAttachments from '../MessageAttachments/MessageAttachments';
import styles from "./Stream.module.css"

import { GoPaperclip } from "react-icons/go";
import unknownAvatar from "../../img/unknownAvatar.png"

const Stream = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const { courseId, chatId } = useParams();
  const { messages } = useSelector((state) => state.chat)
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const { user_id, notification } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!socket || user_id.toString() === "-1") return;

      console.log(`📢 Joining course chat ${chatId}`);
      socket.emit("joinChat", { chatId, user_id, course_id: courseId });

      socket.off("getMessages");
      socket.off("newMessage");

      socket.on("getMessages", (loadedMessages) => {
        const reverseMessage = [...loadedMessages].reverse();
        dispatch(setMessages(reverseMessage));
      });

      socket.on("newMessage", (newMessage) => {
        console.log("🆕 New message received");
        dispatch(addMessageReverse(newMessage));
      });
    };

    fetchMessages();

    return () => {
      if (socket?.emit) {
        dispatch(setMessages([]))
        socket.emit("leaveChat", { courseId });
      }

      socket?.off("getMessages");
      socket?.off("newMessage");
    };

    // eslint-disable-next-line
  }, [socket, user_id, chatId, courseId]);


  useEffect(() => {
    if (user_id.toString === "-1" || messages.length === 0) return;
    const markMessagesAsRead = async () => {
      await markLastMessageAsRead(chatId, user_id, courseId)
      const updatedNotifications = notification.unreadCourses?.filter(id => id !== chatId);
      dispatch(setNotification({
        ...notification,
        unreadCourses: updatedNotifications
      }));
    };
    markMessagesAsRead();
    //eslint-disable-next-line
  }, [messages]);

  const sendMessage = async () => {
    if (socket) {
      const files = attachments.map(att => att.file);
      let uploadedFiles = null;
      if (files.length > 0) uploadedFiles = await uploadFiles(files, "chats");

      socket.emit("sendMessage", { chatId, sender: user_id, text: message, attachments: uploadedFiles });
      setMessage("");
      setAttachments([]);
    }
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

  return (
    <div className={styles.streamContainer}>
      <div className={styles.sendMessageContent}>
        <div className={styles.inputMessage}>
          <input
            type="text"
            placeholder="Share something with your class..."
            className={styles.messageInput}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <label className={styles.fileInputLabel}>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*, .pdf"
              className={styles.fileInput}
            />
            <GoPaperclip className={styles.paperclipIcon} />
          </label>
          <button className={styles.postButton} onClick={sendMessage}>Post</button>
        </div>
        {attachments.length > 0 && <MessageAttachmentsPrewiev attachments={attachments} setAttachments={setAttachments} />}
      </div>
      <div className={styles.streamContent}>
        {messages?.length > 0 ? (
          messages.map((announcement, index) => (
            <div key={announcement.id || index} className={`${styles.messageContent} ${announcement.sender._id === user_id ? styles.own : ""}`}>
              {announcement.sender._id !== user_id && (
                  <img
                    src={announcement.sender.avatar?.trim() || unknownAvatar}
                    alt="avatar"
                    className={styles.anotherUserChatAvatar}
                  />
                )}
                <div className={`${styles.message} ${announcement.sender._id === user_id ? styles.own : ""}`}>
                  <span className={styles.author}>{announcement.author || ""}</span>
                  <CourseMessageAttachments attachments={announcement.attachments} />
                  {announcement.text.trim() && <p className={styles.messageText}>{announcement.text}</p>}
                  <span className={styles.date}>{announcement.created_at || ""}</span>
                </div>
            </div>

          ))
        ) : (
          <div>No announcements yet.</div>
        )}
      </div>
    </div>
  );
};

export default Stream;
