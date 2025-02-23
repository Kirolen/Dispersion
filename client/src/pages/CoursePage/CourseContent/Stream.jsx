import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { findCoursesWithUnreadMessages, markLastCourseMessageAsRead } from '../../../api/personalChatService'
import { useSocket } from '../../../context/SocketContext';

const Stream = () => {
  const { courseId, chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { socket, user_id, setCourseNotification } = useSocket()
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!socket) {
        return;
      }
      console.log(`📢 Joining course chat ${chatId}`);
      socket.emit("joinChat", { chatId, user_id, course_id: courseId });

      socket.on("getMessages", (loadedMessages) => {
        setMessages(loadedMessages);
      });

      socket.on("newMessage", (newMessage) => {
        console.log("new message:", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    };

    fetchMessages();

    return () => {
      if (socket?.emit) {
        console.log(`📤 Leaving course chat ${courseId}`);
        socket.emit("leaveChat", { courseId });
      }
    };
  }, [socket, courseId]);

  useEffect(() => {
    const markMessagesAsRead = async () => {
     // await markLastCourseMessageAsRead(user_id, courseId);
     // const notification = await findCoursesWithUnreadMessages(user_id);
     //
     //  setCourseNotification(notification.unreadCourses);
    };

    markMessagesAsRead();
  }, [messages]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit("sendMessage", { chatId, sender: user_id, text: message, attachments: [] });
      setMessage("");
    }
  };

  return (
    <div className="stream-section">
      <div className="announcement-box">
        <input
          type="text"
          placeholder="Share something with your class..."
          className="announcement-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="post-button" onClick={sendMessage}>Post</button>
      </div>

      <div className="stream-feed">
        {messages?.length > 0 ? (
          messages.map((announcement, index) => (
            <div key={announcement.id || index} className="announcement-card">
              <div className="announcement-header">
                <span className="author">{announcement.author || ""}</span>
                <span className="date">{announcement.created_at || ""}</span>
              </div>
              <p className="announcement-content">{announcement.text || ""}</p>
            </div>
          ))
        ) : (
          <div>No announcements yet.</div>
        )}

        <div ref={endRef}></div>
      </div>
    </div>
  );
};

export default Stream;
