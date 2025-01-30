import React, { useState } from 'react';
import './MessagesPage.css';
import { mockMessages, mockUsers } from '../../mockData/mockData';

const MessagesPage = () => {
  const [messages] = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const getUser = (id) => {
    return mockUsers.find(user => user.id === id);
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h1>Messages</h1>
      </div>

      <div className="messages-content">
        <div className="messages-list">
          {messages.map((message) => {
            const sender = getUser(message.sender_id);
            return (
              <div
                key={message.id}
                className={`message-card ${selectedMessage?.id === message.id ? 'selected' : ''} ${!message.read ? 'unread' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="message-sender">
                  <img src={sender.avatar} alt={sender.first_name} className="sender-avatar" />
                  <div className="sender-info">
                    <h3>{`${sender.first_name} ${sender.last_name}`}</h3>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="message-preview">{message.content}</p>
              </div>
            );
          })}
        </div>

        {selectedMessage && (
          <div className="message-detail">
            <div className="message-detail-header">
              <h2>Message Details</h2>
              <button onClick={() => setSelectedMessage(null)}>Close</button>
            </div>
            <div className="message-detail-content">
              <div className="message-sender-detail">
                <img
                  src={getUser(selectedMessage.sender_id).avatar}
                  alt={getUser(selectedMessage.sender_id).first_name}
                  className="sender-avatar-large"
                />
                <div className="sender-info-detail">
                  <h3>{`${getUser(selectedMessage.sender_id).first_name} ${getUser(selectedMessage.sender_id).last_name}`}</h3>
                  <span>{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <p className="message-content">{selectedMessage.content}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;