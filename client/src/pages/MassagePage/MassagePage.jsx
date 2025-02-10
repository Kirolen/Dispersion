import React, { useState } from 'react';
import './MessagesPage.css';

const MessagesPage = () => {
  const [messages] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Simulated function for getting user info
  const getUser = (id) => {
    // You can replace this with an actual API call to get user data
    return { id, first_name: `User ${id}`, last_name: `Lastname ${id}`, avatar: `https://i.pravatar.cc/150?img=${id}` };
  };

  // Function to handle adding a user
  const handleAddUser = () => {
    const userId = newUser.trim();
    if (userId && !addedUsers.includes(userId)) {
      setAddedUsers([...addedUsers, userId]);
    }
    setNewUser('');
    setShowAddUserModal(false);
  };

  // Handle selecting a user to open a chat
  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };

  // Handle closing the chat
  const handleCloseChat = () => {
    setSelectedUser(null);
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h1>Messages</h1>
      </div>

      <div className="messages-content">
        <div className="messages-list">
          {/* Left Panel: List of added users */}
          {addedUsers.map((userId) => {
            const user = getUser(userId);
            return (
              <div
                key={user.id}
                className={`message-card ${selectedUser === user.id ? 'selected' : ''}`}
                onClick={() => handleUserSelect(user.id)}
              >
                <div className="message-sender">
                  <img src={user.avatar} alt={user.first_name} className="sender-avatar" />
                  <div className="sender-info">
                    <h3>{`${user.first_name} ${user.last_name}`}</h3>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Button to add a new user */}
          <button className="add-user-button" onClick={() => setShowAddUserModal(true)}>
            +
          </button>
        </div>

        <div className="message-detail">
          {/* Right Panel: Chat with selected user */}
          {selectedUser && (
            <div className="chat-window">
              <div className="message-detail-header">
                <h2>{`Chat with ${getUser(selectedUser).first_name} ${getUser(selectedUser).last_name}`}</h2>
                <button onClick={handleCloseChat}>Close Chat</button>
              </div>
              <div className="message-detail-content">
                <div className="message-sender-detail">
                  <img
                    src={getUser(selectedUser).avatar}
                    alt={getUser(selectedUser).first_name}
                    className="sender-avatar-large"
                  />
                  <div className="sender-info-detail">
                    <h3>{`${getUser(selectedUser).first_name} ${getUser(selectedUser).last_name}`}</h3>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                </div>
                <div className="message-content">
                  {/* Here you can display messages of the selected user */}
                  <p>No messages yet.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New User</h2>
            <input
              type="text"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              placeholder="Enter user ID"
            />
            <div className="modal-buttons">
              <button onClick={handleAddUser}>Add User</button>
              <button onClick={() => setShowAddUserModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
