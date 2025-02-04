import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import makeToast from '../../../Toaster/Toaster';


const Stream = ({socket, user_id, setupToken}) => {
  const {courseId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!socket) {
      setupToken() 
      return; 
    }
    console.log(`📢 Joining course chat ${courseId}`);
    socket.emit("joinCourseChat", { courseId });

    socket.on("getMessages", (loadedMessages) => {
        setMessages(loadedMessages);
    });

    socket.on("newMessage", (newMessage) => {
      console.log("new message:", newMessage)
      setMessages((prevMessages) => [...prevMessages, newMessage]);
  });

    return () => {
        if (socket) { 
            console.log(`📤 Leaving course chat ${courseId}`);
            socket.emit("leaveCourseChat", { courseId });
        }
    };
}, [socket, courseId]);


const sendMessage = () => {
  
  console.log(message)
  console.log(socket)
    if (socket && message.trim()) {
        socket.emit("chatroomMessage", { courseId, user_id, message });
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
        {messages.length > 0 ? (
          messages.map((announcement, index) => (
            <div key={announcement.id || index} className="announcement-card">
              <div className="announcement-header">
                <span className="author">{announcement.author || ""}</span>
                <span className="date">{announcement.created_at || ""}</span>
              </div>
              <p className="announcement-content">{announcement.message || ""}</p>
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
